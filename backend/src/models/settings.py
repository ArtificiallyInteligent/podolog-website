"""Model ustawień aplikacji."""

from __future__ import annotations

from datetime import datetime

from sqlalchemy import func

from . import db


class Settings(db.Model):
    """Model przechowujący ustawienia aplikacji."""

    __tablename__ = "settings"

    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String(100), unique=True, nullable=False, index=True)
    value = db.Column(db.Text, nullable=True)
    description = db.Column(db.String(255), nullable=True)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def __init__(
        self,
        key: str,
        value: str | None = None,
        description: str | None = None,
    ) -> None:
        self.key = key
        self.value = value
        self.description = description

    def to_dict(self) -> dict:
        """Konwertuje obiekt na słownik."""
        return {
            "id": self.id,
            "key": self.key,
            "value": self.value,
            "description": self.description,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

    @staticmethod
    def get_value(key: str, default: str | None = None) -> str | None:
        """Pobiera wartość ustawienia po kluczu."""
        setting = Settings.query.filter(func.lower(Settings.key) == key.lower()).first()
        return setting.value if setting else default

    @staticmethod
    def set_value(
        key: str, value: str | None, description: str | None = None
    ) -> Settings:
        """Ustawia wartość ustawienia. Tworzy nowe lub aktualizuje istniejące."""
        setting = Settings.query.filter(func.lower(Settings.key) == key.lower()).first()
        if setting:
            setting.value = value
            if description is not None:
                setting.description = description
        else:
            setting = Settings(key=key, value=value, description=description)
            db.session.add(setting)
        return setting
