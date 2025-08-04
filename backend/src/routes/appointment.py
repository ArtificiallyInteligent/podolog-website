from flask import Blueprint, request, jsonify
from datetime import datetime, date, time, timedelta
from src.models.appointment import db, Appointment, AvailableSlot

appointment_bp = Blueprint('appointment', __name__)

@appointment_bp.route('/appointments', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json()
        
        # Walidacja danych
        required_fields = ['name', 'email', 'service', 'date']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'Pole {field} jest wymagane'}), 400
        
        # Parsowanie daty
        try:
            appointment_date = datetime.strptime(data['date'], '%Y-%m-%d')
        except ValueError:
            return jsonify({'error': 'Nieprawidłowy format daty. Użyj YYYY-MM-DD'}), 400
        
        # Sprawdzenie czy data nie jest w przeszłości
        if appointment_date.date() < date.today():
            return jsonify({'error': 'Nie można umówić wizyty w przeszłości'}), 400
        
        # Tworzenie nowej rezerwacji
        appointment = Appointment(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', ''),
            service=data['service'],
            appointment_date=appointment_date,
            message=data.get('message', ''),
            status='pending'
        )
        
        db.session.add(appointment)
        db.session.commit()
        
        return jsonify({
            'message': 'Rezerwacja została utworzona pomyślnie',
            'appointment': appointment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Wystąpił błąd podczas tworzenia rezerwacji'}), 500

@appointment_bp.route('/appointments', methods=['GET'])
def get_appointments():
    try:
        appointments = Appointment.query.order_by(Appointment.appointment_date.desc()).all()
        return jsonify([appointment.to_dict() for appointment in appointments])
    except Exception as e:
        return jsonify({'error': 'Wystąpił błąd podczas pobierania rezerwacji'}), 500

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['GET'])
def get_appointment(appointment_id):
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        return jsonify(appointment.to_dict())
    except Exception as e:
        return jsonify({'error': 'Rezerwacja nie została znaleziona'}), 404

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['PUT'])
def update_appointment(appointment_id):
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        data = request.get_json()
        
        # Aktualizacja statusu
        if 'status' in data:
            if data['status'] in ['pending', 'confirmed', 'cancelled']:
                appointment.status = data['status']
            else:
                return jsonify({'error': 'Nieprawidłowy status'}), 400
        
        db.session.commit()
        return jsonify({
            'message': 'Rezerwacja została zaktualizowana',
            'appointment': appointment.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Wystąpił błąd podczas aktualizacji rezerwacji'}), 500

@appointment_bp.route('/appointments/<int:appointment_id>', methods=['DELETE'])
def delete_appointment(appointment_id):
    try:
        appointment = Appointment.query.get_or_404(appointment_id)
        db.session.delete(appointment)
        db.session.commit()
        return jsonify({'message': 'Rezerwacja została usunięta'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Wystąpił błąd podczas usuwania rezerwacji'}), 500

@appointment_bp.route('/available-slots', methods=['GET'])
def get_available_slots():
    try:
        # Generowanie dostępnych terminów na następne 30 dni
        available_slots = []
        start_date = date.today() + timedelta(days=1)  # Od jutra
        
        # Godziny pracy: 9:00-18:00, co godzinę
        working_hours = [
            time(9, 0), time(10, 0), time(11, 0), time(12, 0),
            time(13, 0), time(14, 0), time(15, 0), time(16, 0), time(17, 0)
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
                # Sprawdzamy czy termin nie jest już zajęty
                existing_appointment = Appointment.query.filter(
                    db.func.date(Appointment.appointment_date) == current_date,
                    db.func.time(Appointment.appointment_date) == hour,
                    Appointment.status.in_(['pending', 'confirmed'])
                ).first()
                
                if not existing_appointment:
                    available_slots.append({
                        'date': current_date.isoformat(),
                        'time': hour.isoformat(),
                        'datetime': datetime.combine(current_date, hour).isoformat()
                    })
        
        return jsonify(available_slots)
        
    except Exception as e:
        return jsonify({'error': 'Wystąpił błąd podczas pobierania dostępnych terminów'}), 500

@appointment_bp.route('/services', methods=['GET'])
def get_services():
    services = [
        {
            'id': 'pedicure',
            'name': 'Pedicure podologiczny',
            'description': 'Profesjonalna pielęgnacja stóp z usuwaniem modzeli i nagniotków',
            'price': 'od 80 zł',
            'duration': 60
        },
        {
            'id': 'paznokcie',
            'name': 'Leczenie wrastających paznokci',
            'description': 'Bezbolesne leczenie wrastających paznokci metodą klamrową',
            'price': 'od 120 zł',
            'duration': 45
        },
        {
            'id': 'brodawki',
            'name': 'Usuwanie brodawek',
            'description': 'Skuteczne usuwanie brodawek wirusowych metodami podologicznymi',
            'price': 'od 100 zł',
            'duration': 30
        },
        {
            'id': 'orteza',
            'name': 'Orteza na paznokcie',
            'description': 'Korekcja kształtu paznokci za pomocą specjalnych ortez',
            'price': 'od 150 zł',
            'duration': 90
        }
    ]
    return jsonify(services)
