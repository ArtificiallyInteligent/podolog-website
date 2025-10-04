"""Endpointy API dla zarządzania ustawieniami aplikacji."""

from __future__ import annotations

from typing import Any

from flask import Blueprint, current_app, jsonify, request
from sqlalchemy.exc import SQLAlchemyError

from src.models import Settings, db

settings_bp = Blueprint("settings", __name__)


@settings_bp.route("/settings", methods=["GET"])
def get_all_settings() -> Any:
    """Pobiera wszystkie ustawienia."""
    try:
        settings = Settings.query.order_by(Settings.key).all()
        return jsonify([setting.to_dict() for setting in settings])
    except SQLAlchemyError:
        current_app.logger.exception("Błąd podczas pobierania ustawień")
        return jsonify({"error": "Wystąpił błąd podczas pobierania ustawień"}), 500


@settings_bp.route("/settings/<string:key>", methods=["GET"])
def get_setting(key: str) -> Any:
    """Pobiera pojedyncze ustawienie po kluczu."""
    setting = Settings.query.filter(db.func.lower(Settings.key) == key.lower()).first()
    if not setting:
        return jsonify({"error": "Ustawienie nie zostało znalezione"}), 404

    return jsonify(setting.to_dict())


@settings_bp.route("/settings", methods=["POST"])
def create_or_update_setting() -> Any:
    """Tworzy nowe ustawienie lub aktualizuje istniejące."""
    data = request.get_json() or {}

    key = (data.get("key") or "").strip()
    value = data.get("value")
    description = (data.get("description") or "").strip() or None

    if not key:
        return jsonify({"error": "Klucz ustawienia jest wymagany"}), 400

    try:
        setting = Settings.set_value(key, value, description)
        db.session.commit()
        return jsonify(setting.to_dict()), 200
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Błąd podczas zapisywania ustawienia")
        return jsonify({"error": "Nie udało się zapisać ustawienia"}), 500


@settings_bp.route("/settings/bulk", methods=["POST"])
def update_settings_bulk() -> Any:
    """Aktualizuje wiele ustawień jednocześnie."""
    data = request.get_json() or {}

    if not isinstance(data, dict) or "settings" not in data:
        return jsonify({"error": "Nieprawidłowy format danych"}), 400

    settings_data = data.get("settings", [])
    if not isinstance(settings_data, list):
        return jsonify({"error": "Pole 'settings' musi być tablicą"}), 400

    try:
        updated_settings = []
        for item in settings_data:
            if not isinstance(item, dict):
                continue

            key = (item.get("key") or "").strip()
            if not key:
                continue

            value = item.get("value")
            description = (item.get("description") or "").strip() or None

            setting = Settings.set_value(key, value, description)
            updated_settings.append(setting)

        db.session.commit()
        return jsonify(
            {
                "message": f"Zaktualizowano {len(updated_settings)} ustawień",
                "settings": [s.to_dict() for s in updated_settings],
            }
        ), 200
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Błąd podczas zapisywania ustawień")
        return jsonify({"error": "Nie udało się zapisać ustawień"}), 500


@settings_bp.route("/settings/<string:key>", methods=["DELETE"])
def delete_setting(key: str) -> Any:
    """Usuwa ustawienie."""
    setting = Settings.query.filter(db.func.lower(Settings.key) == key.lower()).first()

    if not setting:
        return jsonify({"error": "Ustawienie nie zostało znalezione"}), 404

    try:
        db.session.delete(setting)
        db.session.commit()
        return jsonify({"message": "Ustawienie zostało usunięte"}), 200
    except SQLAlchemyError:
        db.session.rollback()
        current_app.logger.exception("Błąd podczas usuwania ustawienia")
        return jsonify({"error": "Nie udało się usunąć ustawienia"}), 500
