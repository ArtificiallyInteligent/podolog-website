from __future__ import annotations

from decimal import Decimal
from typing import Optional

from .user import db


class ServiceCategory(db.Model):
    __tablename__ = "service_categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )

    services = db.relationship(
        "Service",
        back_populates="category",
        cascade="all, delete-orphan",
        lazy="joined",
    )

    def to_dict(self) -> dict[str, Optional[str | int]]:
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Service(db.Model):
    __tablename__ = "services"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(140), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Numeric(10, 2), nullable=False, default=Decimal("0.00"))
    duration_minutes = db.Column(db.Integer, nullable=False, default=60)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    updated_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp(),
    )

    category_id = db.Column(
        db.Integer,
        db.ForeignKey("service_categories.id", ondelete="CASCADE"),
        nullable=False,
    )
    category = db.relationship(
        "ServiceCategory", back_populates="services", lazy="joined"
    )

    def to_dict(self) -> dict[str, Optional[str | int | float | bool]]:
        price_value = float(self.price) if self.price is not None else 0.0
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "price": price_value,
            "duration_minutes": self.duration_minutes,
            "is_active": self.is_active,
            "category_id": self.category_id,
            "category": self.category.to_dict() if self.category else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
