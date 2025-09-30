from __future__ import annotations

from datetime import date, datetime
from typing import Any

from flask import Blueprint, jsonify
from sqlalchemy import func

from src.models import Appointment, Service, ServiceCategory, db

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/admin/summary", methods=["GET"])
def get_admin_summary() -> Any:
    now = datetime.utcnow()
    today = date.today()

    total_appointments = Appointment.query.count()
    pending_appointments = Appointment.query.filter_by(status="pending").count()
    confirmed_appointments = Appointment.query.filter_by(status="confirmed").count()
    cancelled_appointments = Appointment.query.filter_by(status="cancelled").count()
    upcoming_appointments = (
        Appointment.query.filter(Appointment.status.in_(["pending", "confirmed"]))
        .filter(Appointment.appointment_date >= now)
        .count()
    )
    today_appointments = Appointment.query.filter(
        func.date(Appointment.appointment_date) == today
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
    categories = ServiceCategory.query.count()
    services = Service.query.count()
    appointments = Appointment.query.count()

    return jsonify(
        {
            "status": "ok",
            "timestamp": datetime.utcnow().isoformat(),
            "counts": {
                "categories": categories,
                "services": services,
                "appointments": appointments,
            },
        }
    )
