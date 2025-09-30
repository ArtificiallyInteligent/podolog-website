# Re-export commonly used models for convenience

from .user import User, db  # noqa: F401
from .appointment import Appointment, AvailableSlot  # noqa: F401
from .service import Service, ServiceCategory  # noqa: F401

__all__ = [
    "db",
    "User",
    "Appointment",
    "AvailableSlot",
    "Service",
    "ServiceCategory",
]
