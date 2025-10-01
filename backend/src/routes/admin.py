from __future__ import annotations

from datetime import date, datetime, timezone
from typing import Any, cast

from flask import Blueprint, current_app, jsonify
from sqlalchemy import func
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm.attributes import InstrumentedAttribute

from src.models import Appointment, Service, ServiceCategory, db

admin_bp = Blueprint("admin", __name__)

STATUS_COLUMN = cast(InstrumentedAttribute[str], Appointment.status)
APPOINTMENT_DATE_COLUMN = cast(
    InstrumentedAttribute[datetime], Appointment.appointment_date
)


@admin_bp.route("/admin/summary", methods=["GET"])
def get_admin_summary() -> Any:
    now = datetime.utcnow()
    today = date.today()

    try:
        total_appointments = Appointment.query.count()
        pending_appointments = Appointment.query.filter_by(status="pending").count()
        confirmed_appointments = Appointment.query.filter_by(status="confirmed").count()
        cancelled_appointments = Appointment.query.filter_by(status="cancelled").count()
        upcoming_appointments = (
            Appointment.query.filter(STATUS_COLUMN.in_(["pending", "confirmed"]))
            .filter(APPOINTMENT_DATE_COLUMN >= now)
            .count()
        )
        today_appointments = Appointment.query.filter(
            func.date(APPOINTMENT_DATE_COLUMN) == today
        ).count()

        total_services = Service.query.count()
        active_services = Service.query.filter_by(is_active=True).count()
        average_price = db.session.query(func.avg(Service.price)).scalar() or 0

        service_prices = {
            service.name.lower(): float(service.price or 0)
            for service in Service.query.filter_by(is_active=True).all()
        }

        confirmed_list = Appointment.query.filter_by(status="confirmed").all()
        potential_revenue = sum(
            service_prices.get((appointment.service or "").lower(), 0)
            for appointment in confirmed_list
        )

    except SQLAlchemyError:
        current_app.logger.exception("Błąd podczas pobierania danych administratora")
        return (
            jsonify(
                {"error": "Wystąpił błąd podczas pobierania danych administratora"}
            ),
            500,
        )

    return jsonify(
        {
            "appointments": {
                "total": total_appointments,
                "pending": pending_appointments,
                "confirmed": confirmed_appointments,
                "cancelled": cancelled_appointments,
                "upcoming": upcoming_appointments,
                "today": today_appointments,
            },
            "services": {
                "total": total_services,
                "active": active_services,
                "averagePrice": float(average_price),
            },
            "financials": {
                "potentialRevenue": float(potential_revenue),
            },
        }
    )


@admin_bp.route("/admin/health", methods=["GET"])
def health_check() -> Any:
    try:
        categories = ServiceCategory.query.count()
        services = Service.query.count()
        appointments = Appointment.query.count()
    except SQLAlchemyError:
        current_app.logger.exception("Błąd podczas sprawdzania stanu aplikacji")
        return (
            jsonify({"status": "error", "message": "Błąd bazy danych"}),
            500,
        )

    return jsonify(
        {
            "status": "ok",
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "counts": {
                "categories": categories,
                "services": services,
                "appointments": appointments,
            },
        }
    )
