from typing import cast

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm.attributes import InstrumentedAttribute

from src.models.user import User, db

user_bp = Blueprint("user", __name__)

CREATED_AT_COLUMN = cast(InstrumentedAttribute, User.created_at)


@user_bp.route("/users", methods=["GET"])
def get_users():
    try:
        users = User.query.order_by(CREATED_AT_COLUMN.desc()).all()
        return jsonify([user.to_dict() for user in users])
    except SQLAlchemyError:
        current_app.logger.exception("Błąd podczas pobierania użytkowników")
        return jsonify({"error": "Wystąpił błąd podczas pobierania użytkowników"}), 500


@user_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json(silent=True) or {}

    if not isinstance(data, dict):
        return jsonify({"error": "Nieprawidłowy format danych"}), 400

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip().lower()
    phone = str(data.get("phone", "")).strip() or None

    if not name or not email:
        return jsonify({"error": "Nazwa i email są wymagane"}), 400

    try:
        existing_user = User.query.filter(User.email == email).first()
        if existing_user:
            return jsonify({"error": "Użytkownik z tym emailem już istnieje"}), 409

        user = User()
        user.name = name
        user.email = email
        user.phone = phone

        db.session.add(user)
        db.session.commit()
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Błąd podczas tworzenia użytkownika")
        return jsonify({"error": "Wystąpił błąd podczas tworzenia użytkownika"}), 500

    return jsonify(
        {"message": "Użytkownik został utworzony pomyślnie", "user": user.to_dict()}
    ), 201
