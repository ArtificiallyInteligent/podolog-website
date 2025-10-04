"""Moduł pomocniczy do wysyłania emaili."""

from __future__ import annotations

from flask import current_app, render_template_string
from flask_mail import Mail, Message

from src.models import Settings


def get_mail_instance() -> Mail | None:
    """Pobiera instancję Mail z aplikacji."""
    return current_app.extensions.get("mail")


def send_appointment_notification(appointment_data: dict) -> bool:
    """
    Wysyła email z powiadomieniem o nowej rezerwacji.

    Args:
        appointment_data: Słownik z danymi rezerwacji

    Returns:
        True jeśli email został wysłany pomyślnie, False w przeciwnym razie
    """
    try:
        # Pobierz ustawienia email z bazy danych
        mail_username = Settings.get_value("mail_username")
        mail_password = Settings.get_value("mail_password")

        if not mail_username or not mail_password:
            current_app.logger.warning(
                "Brak skonfigurowanych danych logowania Gmail (mail_username lub mail_password)"
            )
            return False

        # Zaktualizuj konfigurację Flask z danymi z bazy
        current_app.config["MAIL_USERNAME"] = mail_username
        current_app.config["MAIL_PASSWORD"] = mail_password
        current_app.config["MAIL_DEFAULT_SENDER"] = mail_username

        mail = get_mail_instance()
        if not mail:
            current_app.logger.warning("Flask-Mail nie jest skonfigurowany")
            return False

        # Pobierz email odbiorcy z ustawień
        recipient_email = Settings.get_value("notification_email")
        if not recipient_email:
            current_app.logger.warning(
                "Brak skonfigurowanego adresu email dla powiadomień"
            )
            return False

        # Pobierz dane nadawcy z ustawień
        sender_email = Settings.get_value("mail_username")
        if not sender_email:
            # Fallback na konfigurację z app.config
            sender_email = current_app.config.get(
                "MAIL_DEFAULT_SENDER"
            ) or current_app.config.get("MAIL_USERNAME")
            if not sender_email:
                current_app.logger.warning("Brak skonfigurowanego adresu email nadawcy")
                return False

        # Pobierz nazwę gabinetu z ustawień (opcjonalne)
        clinic_name = Settings.get_value("clinic_name", "Gabinet Podologiczny")

        # Przygotuj treść emaila
        subject = f"Nowa rezerwacja: {appointment_data.get('service', 'Usługa')}"

        html_body = render_template_string(
            """
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .info-row { margin: 15px 0; padding: 10px; background: white; border-radius: 5px; }
                    .label { font-weight: bold; color: #667eea; }
                    .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>{{ clinic_name }}</h1>
                        <p>Nowa rezerwacja wizyty</p>
                    </div>
                    <div class="content">
                        <h2>Szczegóły rezerwacji</h2>
                        
                        <div class="info-row">
                            <span class="label">Pacjent:</span> {{ name }}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Email:</span> {{ email }}
                        </div>
                        
                        {% if phone %}
                        <div class="info-row">
                            <span class="label">Telefon:</span> {{ phone }}
                        </div>
                        {% endif %}
                        
                        <div class="info-row">
                            <span class="label">Usługa:</span> {{ service }}
                        </div>
                        
                        <div class="info-row">
                            <span class="label">Data i godzina:</span> {{ appointment_date }}
                        </div>
                        
                        {% if message %}
                        <div class="info-row">
                            <span class="label">Wiadomość:</span><br>
                            {{ message }}
                        </div>
                        {% endif %}
                        
                        <div class="info-row">
                            <span class="label">Status:</span> <strong>Oczekuje potwierdzenia</strong>
                        </div>
                    </div>
                    <div class="footer">
                        <p>To jest automatyczna wiadomość z systemu rezerwacji {{ clinic_name }}</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            clinic_name=clinic_name,
            name=appointment_data.get("name", ""),
            email=appointment_data.get("email", ""),
            phone=appointment_data.get("phone", ""),
            service=appointment_data.get("service", ""),
            appointment_date=appointment_data.get("appointment_date", ""),
            message=appointment_data.get("message", ""),
        )

        text_body = f"""
        Nowa rezerwacja w {clinic_name}
        
        Pacjent: {appointment_data.get("name", "")}
        Email: {appointment_data.get("email", "")}
        Telefon: {appointment_data.get("phone", "nie podano")}
        Usługa: {appointment_data.get("service", "")}
        Data i godzina: {appointment_data.get("appointment_date", "")}
        Wiadomość: {appointment_data.get("message", "brak")}
        
        Status: Oczekuje potwierdzenia
        """

        msg = Message(
            subject=subject,
            sender=sender_email,
            recipients=[recipient_email],
            body=text_body,
            html=html_body,
        )

        # Użyj kontekstu połączenia aby zastosować zaktualizowane dane logowania
        with mail.connect() as conn:
            conn.send(msg)

        current_app.logger.info(f"Email z powiadomieniem wysłany do {recipient_email}")
        return True

    except Exception as e:
        current_app.logger.error(f"Błąd podczas wysyłania emaila: {str(e)}")
        return False
