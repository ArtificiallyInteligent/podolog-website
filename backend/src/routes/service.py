from __future__ import annotations

from decimal import Decimal
from typing import Any

from flask import Blueprint, jsonify, request

from src.models import Service, ServiceCategory, db

service_bp = Blueprint("service", __name__)


@service_bp.route("/service-categories", methods=["GET"])
def list_categories() -> Any:
    categories = ServiceCategory.query.order_by(ServiceCategory.name.asc()).all()
    return jsonify([category.to_dict() for category in categories])


@service_bp.route("/service-categories", methods=["POST"])
def create_category() -> Any:
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip() or None

    if not name:
        return jsonify({"error": "Nazwa kategorii jest wymagana"}), 400

    existing = ServiceCategory.query.filter(
        db.func.lower(ServiceCategory.name) == name.lower()
    ).first()
    if existing:
        return jsonify({"error": "Kategoria o tej nazwie już istnieje"}), 409

    category = ServiceCategory()
    category.name = name
    category.description = description
    db.session.add(category)
    db.session.commit()
    return jsonify(category.to_dict()), 201


@service_bp.route("/service-categories/<int:category_id>", methods=["PUT"])
def update_category(category_id: int) -> Any:
    category = ServiceCategory.query.get_or_404(category_id)
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip() or None

    if not name:
        return jsonify({"error": "Nazwa kategorii jest wymagana"}), 400

    conflict = (
        ServiceCategory.query.filter(
            db.func.lower(ServiceCategory.name) == name.lower()
        )
        .filter(ServiceCategory.id != category_id)
        .first()
    )
    if conflict:
        return jsonify({"error": "Inna kategoria posiada tę nazwę"}), 409

    category.name = name
    category.description = description
    db.session.commit()
    return jsonify(category.to_dict())


@service_bp.route("/service-categories/<int:category_id>", methods=["DELETE"])
def delete_category(category_id: int) -> Any:
    category = ServiceCategory.query.get_or_404(category_id)
    if category.services:
        return jsonify(
            {"error": "Usuń lub przenieś usługi przed usunięciem kategorii"}
        ), 400

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Kategoria została usunięta"})


@service_bp.route("/services", methods=["GET"])
def list_services() -> Any:
    services = (
        Service.query.options(db.joinedload(Service.category))
        .order_by(Service.is_active.desc(), Service.name.asc())
        .all()
    )
    return jsonify([service.to_dict() for service in services])


@service_bp.route("/services", methods=["POST"])
def create_service() -> Any:
    data = request.get_json() or {}
    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip() or None
    price_raw = data.get("price", 0)
    duration_minutes = int(data.get("duration_minutes") or 0)
    is_active = bool(data.get("is_active", True))
    category_id = data.get("category_id")

    if not name or not category_id:
        return jsonify({"error": "Nazwa usługi i kategoria są wymagane"}), 400

    if duration_minutes <= 0:
        return jsonify({"error": "Czas trwania musi być dodatni"}), 400

    try:
        price = Decimal(str(price_raw))
        if price < 0:
            raise ValueError
    except Exception:
        return jsonify({"error": "Nieprawidłowa cena"}), 400

    category = ServiceCategory.query.get(category_id)
    if category is None:
        return jsonify({"error": "Wybrana kategoria nie istnieje"}), 404

    service = Service()
    service.name = name
    service.description = description
    service.price = price
    service.duration_minutes = duration_minutes
    service.is_active = is_active
    service.category = category
    db.session.add(service)
    db.session.commit()
    return jsonify(service.to_dict()), 201


@service_bp.route("/services/<int:service_id>", methods=["PUT"])
def update_service(service_id: int) -> Any:
    service = Service.query.get_or_404(service_id)
    data = request.get_json() or {}

    name = (data.get("name") or "").strip()
    description = (data.get("description") or "").strip() or None
    price_raw = data.get("price", 0)
    duration_minutes = int(data.get("duration_minutes") or 0)
    is_active = bool(data.get("is_active", True))
    category_id = data.get("category_id")

    if not name or not category_id:
        return jsonify({"error": "Nazwa usługi i kategoria są wymagane"}), 400

    if duration_minutes <= 0:
        return jsonify({"error": "Czas trwania musi być dodatni"}), 400

    try:
        price = Decimal(str(price_raw))
        if price < 0:
            raise ValueError
    except Exception:
        return jsonify({"error": "Nieprawidłowa cena"}), 400

    category = ServiceCategory.query.get(category_id)
    if category is None:
        return jsonify({"error": "Wybrana kategoria nie istnieje"}), 404

    service.name = name
    service.description = description
    service.price = price
    service.duration_minutes = duration_minutes
    service.is_active = is_active
    service.category = category

    db.session.commit()
    return jsonify(service.to_dict())


@service_bp.route("/services/<int:service_id>", methods=["DELETE"])
def delete_service(service_id: int) -> Any:
    service = Service.query.get_or_404(service_id)
    db.session.delete(service)
    db.session.commit()
    return jsonify({"message": "Usługa została usunięta"})
