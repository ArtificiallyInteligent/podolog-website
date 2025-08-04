from flask import Blueprint, request, jsonify
from src.models.user import db, User

user_bp = Blueprint('user', __name__)

@user_bp.route('/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        return jsonify([user.to_dict() for user in users])
    except Exception as e:
        return jsonify({'error': 'Wystąpił błąd podczas pobierania użytkowników'}), 500

@user_bp.route('/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        
        # Walidacja danych
        if not data.get('name') or not data.get('email'):
            return jsonify({'error': 'Nazwa i email są wymagane'}), 400
        
        # Sprawdzenie czy email już istnieje
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user:
            return jsonify({'error': 'Użytkownik z tym emailem już istnieje'}), 400
        
        # Tworzenie nowego użytkownika
        user = User(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone', '')
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({
            'message': 'Użytkownik został utworzony pomyślnie',
            'user': user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Wystąpił błąd podczas tworzenia użytkownika'}), 500
