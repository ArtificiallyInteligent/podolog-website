"""Skrypt migracji - dodanie tabeli Settings."""

import os
import sys

# Dodaj katalog główny do ścieżki
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from src.models import Settings, db
from app import app


def create_settings_table():
    """Tworzy tabelę Settings w bazie danych."""
    with app.app_context():
        # Utwórz tabelę Settings
        db.create_all()
        print("✅ Tabela Settings została utworzona")

        # Sprawdź czy są już jakieś ustawienia
        existing_settings = Settings.query.all()
        if existing_settings:
            print(f"ℹ️  Znaleziono {len(existing_settings)} istniejących ustawień")
            return

        # Dodaj domyślne ustawienia
        default_settings = [
            Settings(
                key="notification_email",
                value="",
                description="Adres email, na który będą przychodzić powiadomienia o nowych rezerwacjach",
            ),
            Settings(
                key="clinic_name",
                value="Gabinet Podologiczny",
                description="Nazwa gabinetu wyświetlana w emailach",
            ),
            Settings(
                key="mail_username",
                value="",
                description="Adres email Gmail używany do wysyłki powiadomień",
            ),
            Settings(
                key="mail_password", value="", description="Hasło aplikacji Gmail"
            ),
        ]

        for setting in default_settings:
            db.session.add(setting)

        db.session.commit()
        print(f"✅ Dodano {len(default_settings)} domyślnych ustawień")


if __name__ == "__main__":
    create_settings_table()
    print("\n🎉 Migracja zakończona pomyślnie!")
    print("\n📝 Następne kroki:")
    print("1. Przejdź do panelu administratora")
    print("2. Kliknij 'Ustawienia' w menu bocznym")
    print("3. Wypełnij formularz konfiguracji email")
    print("4. Zapisz ustawienia\n")
