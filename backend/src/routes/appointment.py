from datetime import date, datetime, time, timedelta
from typing import cast

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm.attributes import InstrumentedAttribute

from src.models.appointment import Appointment, db

appointment_bp = Blueprint("appointment", __name__)

STATUS_COLUMN = cast(InstrumentedAttribute[str], Appointment.status)
APPOINTMENT_DATE_COLUMN = cast(
    InstrumentedAttribute[datetime], Appointment.appointment_date
)


DEFAULT_APPOINTMENT_TIME = time(9, 0)


@appointment_bp.route("/appointments", methods=["POST"])
def create_appointment():
    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "Nieprawidłowy format danych"}), 400

    required_fields = ("name", "email", "service", "date")
    missing_fields = [
        field for field in required_fields if not str(data.get(field, "")).strip()
    ]
    if missing_fields:
        return (
            jsonify(
                {
                    "error": "Brakuje wymaganych danych",
                    "fields": missing_fields,
                }
            ),
            400,
        )

    date_str = str(data.get("date", "")).strip()
    time_str = str(data.get("time", "")).strip()
    datetime_str = str(data.get("datetime", "")).strip()

    appointment_datetime: datetime | None = None

    if datetime_str:
        try:
            appointment_datetime = datetime.fromisoformat(datetime_str)
        except ValueError:
            return jsonify({"error": "Nieprawidłowy format pola datetime"}), 400

    if appointment_datetime is None:
        try:
            parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            return jsonify({"error": "Nieprawidłowy format daty. Użyj YYYY-MM-DD"}), 400

        if time_str:
            try:
                parsed_time = datetime.strptime(time_str, "%H:%M").time()
            except ValueError:
                return jsonify({"error": "Nieprawidłowy format czasu. Użyj HH:MM"}), 400
        else:
            parsed_time = DEFAULT_APPOINTMENT_TIME

        appointment_datetime = datetime.combine(parsed_date, parsed_time)

    if appointment_datetime < datetime.now():
        return jsonify({"error": "Nie można umówić wizyty w przeszłości"}), 400

    appointment = Appointment(
        name=str(data.get("name", "")).strip(),
        email=str(data.get("email", "")).strip(),
        phone=str(data.get("phone", "")).strip() or None,
        service=str(data.get("service", "")).strip(),
        appointment_date=appointment_datetime,
        message=str(data.get("message", "")).strip() or None,
        status="pending",
    )

    try:
        db.session.add(appointment)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Błąd podczas zapisu rezerwacji")
        return jsonify({"error": "Wystąpił błąd podczas tworzenia rezerwacji"}), 500

    return (
        jsonify(
            {
                "message": "Rezerwacja została utworzona pomyślnie",
                "appointment": appointment.to_dict(),
            }
        ),
        201,
    )


@appointment_bp.route("/appointments", methods=["GET"])
def get_appointments():
    try:
        appointments = Appointment.query.order_by(APPOINTMENT_DATE_COLUMN.desc()).all()
        return jsonify([appointment.to_dict() for appointment in appointments])
    except SQLAlchemyError:
        current_app.logger.exception("Błąd podczas pobierania rezerwacji")
        return jsonify({"error": "Wystąpił błąd podczas pobierania rezerwacji"}), 500


@appointment_bp.route("/appointments/<int:appointment_id>", methods=["GET"])
def get_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    return jsonify(appointment.to_dict())


@appointment_bp.route("/appointments/<int:appointment_id>", methods=["PUT"])
def update_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)
    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "Nieprawidłowy format danych"}), 400

    if "status" in data:
        new_status = str(data["status"]).strip()
        if new_status not in {"pending", "confirmed", "cancelled"}:
            return jsonify({"error": "Nieprawidłowy status"}), 400
        appointment.status = new_status

    try:
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Błąd podczas aktualizacji rezerwacji")
        return jsonify({"error": "Wystąpił błąd podczas aktualizacji rezerwacji"}), 500

    return jsonify(
        {
            "message": "Rezerwacja została zaktualizowana",
            "appointment": appointment.to_dict(),
        }
    )


@appointment_bp.route("/appointments/<int:appointment_id>", methods=["DELETE"])
def delete_appointment(appointment_id):
    appointment = Appointment.query.get_or_404(appointment_id)

    try:
        db.session.delete(appointment)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Błąd podczas usuwania rezerwacji")
        return jsonify({"error": "Wystąpił błąd podczas usuwania rezerwacji"}), 500

    return jsonify({"message": "Rezerwacja została usunięta"}), 200


@appointment_bp.route("/available-slots", methods=["GET"])
def get_available_slots():
    try:
        # Generowanie dostępnych terminów na następne 30 dni
        available_slots = []
        start_date = date.today() + timedelta(days=1)  # Od jutra

        # Godziny pracy: 9:00-18:00, co godzinę
        working_hours = [
            time(9, 0),
            time(10, 0),
            time(11, 0),
            time(12, 0),
            time(13, 0),
            time(14, 0),
            time(15, 0),
            time(16, 0),
            time(17, 0),
        ]

        for i in range(30):  # 30 dni do przodu
            current_date = start_date + timedelta(days=i)

            # Pomijamy niedziele (weekday 6)
            if current_date.weekday() == 6:
                continue

            # Soboty tylko do 14:00
            if current_date.weekday() == 5:
                day_hours = [t for t in working_hours if t.hour <= 14]
            else:
                day_hours = working_hours

            for hour in day_hours:
                slot_start = datetime.combine(current_date, hour)
                slot_end = slot_start + timedelta(hours=1)

                existing_appointment = Appointment.query.filter(
                    STATUS_COLUMN.in_(["pending", "confirmed"]),
                    APPOINTMENT_DATE_COLUMN >= slot_start,
                    APPOINTMENT_DATE_COLUMN < slot_end,
                ).first()

                if not existing_appointment:
                    available_slots.append(
                        {
                            "date": current_date.isoformat(),
                            "time": hour.isoformat(timespec="minutes"),
                            "datetime": slot_start.isoformat(),
                        }
                    )

        return jsonify(available_slots)

    except SQLAlchemyError:
        current_app.logger.exception("Błąd podczas pobierania dostępnych terminów")
        return (
            jsonify({"error": "Wystąpił błąd podczas pobierania dostępnych terminów"}),
            500,
        )
