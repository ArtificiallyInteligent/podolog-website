import os
import sys

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_mail import Mail
from src.models import Service, ServiceCategory, db
from src.routes.user import user_bp
from src.routes.appointment import appointment_bp
from src.routes.service import service_bp
from src.routes.admin import admin_bp
from src.routes.settings import settings_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), "static"))
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "a-very-secret-dev-key")

# Konfiguracja Flask-Mail dla Gmail
app.config["MAIL_SERVER"] = os.environ.get("MAIL_SERVER", "smtp.gmail.com")
app.config["MAIL_PORT"] = int(os.environ.get("MAIL_PORT", "587"))
app.config["MAIL_USE_TLS"] = os.environ.get("MAIL_USE_TLS", "true").lower() == "true"
app.config["MAIL_USE_SSL"] = os.environ.get("MAIL_USE_SSL", "false").lower() == "true"
app.config["MAIL_USERNAME"] = os.environ.get("MAIL_USERNAME", "")
app.config["MAIL_PASSWORD"] = os.environ.get("MAIL_PASSWORD", "")
app.config["MAIL_DEFAULT_SENDER"] = os.environ.get(
    "MAIL_DEFAULT_SENDER", app.config["MAIL_USERNAME"]
)

mail = Mail(app)

# Włączenie CORS dla wszystkich tras
CORS(app)

app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(appointment_bp, url_prefix="/api")
app.register_blueprint(service_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")
app.register_blueprint(settings_bp, url_prefix="/api")

# uncomment if you need to use database
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)
with app.app_context():
    db.create_all()
    _categories_count = ServiceCategory.query.count()
    _services_count = Service.query.count()
    if _categories_count == 0 and _services_count == 0:
        starter_categories = [
            ("Podstawowe zabiegi", "Konsultacje i podstawowa pielęgnacja"),
            ("Zabiegi specjalistyczne", "Zaawansowane zabiegi korekcyjne"),
            ("Korekcja i ortopedia", "Wsparcie strukturalne stóp"),
            ("Usługi dodatkowe", "Uzupełniające terapie i wizyty"),
        ]
        category_map: dict[str, ServiceCategory] = {}
        for name, description in starter_categories:
            category = ServiceCategory()
            category.name = name
            category.description = description
            db.session.add(category)
            category_map[name] = category

        db.session.flush()

        # Dane zgodne z uslugi-podologiczne.md
        starter_services = [
            # PODSTAWOWE ZABIEGI
            (
                "Konsultacja podologiczna",
                "Profesjonalna ocena stanu zdrowia stóp i doradztwo",
                100.00,
                45,
                "Podstawowe zabiegi",
            ),
            (
                "Podstawowy zabieg podologiczny",
                "Kompleksowa pielęgnacja stóp z profesjonalnym podejściem",
                170.00,
                75,
                "Podstawowe zabiegi",
            ),
            (
                "Obcięcie paznokci - zdrowe",
                "Prawidłowe obcięcie zdrowych paznokci u stóp",
                100.00,
                30,
                "Podstawowe zabiegi",
            ),
            (
                "Obcięcie paznokci - zmienione chorobowo",
                "Obcięcie paznokci zmienionych chorobowo",
                150.00,
                45,
                "Podstawowe zabiegi",
            ),
            (
                "Pękające pięty",
                "Leczenie i pielęgnacja pękających pięt",
                150.00,
                50,
                "Podstawowe zabiegi",
            ),
            # ZABIEGI SPECJALISTYCZNE
            (
                "Usunięcie odcisku",
                "Bezbolesne usuwanie odcisków z zastosowaniem profesjonalnych narzędzi",
                100.00,
                30,
                "Zabiegi specjalistyczne",
            ),
            (
                "Opracowanie modzeli",
                "Precyzyjne opracowanie modzeli",
                130.00,
                40,
                "Zabiegi specjalistyczne",
            ),
            (
                "Leczenie brodawek",
                "Skuteczne leczenie brodawek wirusowych metodami podologicznymi",
                120.00,
                40,
                "Zabiegi specjalistyczne",
            ),
            (
                "Rekonstrukcja paznokci",
                "Odbudowa uszkodzonych lub brakujących paznokci",
                150.00,
                60,
                "Zabiegi specjalistyczne",
            ),
            (
                "Badanie mykologiczne",
                "Diagnostyka grzybicy paznokci i stóp",
                150.00,
                30,
                "Zabiegi specjalistyczne",
            ),
            # KOREKCJA I ORTOPEDIA
            (
                "Podcięcie elementu wrastającego + opatrunek",
                "Leczenie wrastających paznokci z opatrunkiem",
                150.00,
                45,
                "Korekcja i ortopedia",
            ),
            (
                "Założenie klamry korygującej",
                "Bezbolesne leczenie wrastających paznokci metodą klamrową",
                200.00,
                60,
                "Korekcja i ortopedia",
            ),
            (
                "Przełożenie klamry",
                "Przełożenie klamry korygującej",
                150.00,
                45,
                "Korekcja i ortopedia",
            ),
            (
                "Tamponada",
                "Metoda leczenia wrastających paznokci z użyciem tamponady",
                0.00,
                30,
                "Korekcja i ortopedia",
            ),
            (
                "Orteza",
                "Korekcja kształtu paznokci za pomocą specjalnych ortez",
                0.00,
                60,
                "Korekcja i ortopedia",
            ),
            (
                "Separator palców",
                "Korekcja ustawienia palców stóp",
                0.00,
                30,
                "Korekcja i ortopedia",
            ),
            (
                "Klin silikonowy",
                "Zastosowanie klinów silikonowych do korekcji",
                0.00,
                30,
                "Korekcja i ortopedia",
            ),
            # USŁUGI DODATKOWE
            (
                "Taping (kinesiotaping)",
                "Terapeutyczne oklejanie stóp taśmami kinesio",
                40.00,
                30,
                "Usługi dodatkowe",
            ),
            (
                "Wizyty domowe",
                "Profesjonalna opieka podologiczna w zaciszu własnego domu (cena dojazdu indywidualna)",
                0.00,
                60,
                "Usługi dodatkowe",
            ),
            (
                "Leczenie onycholizy",
                "Leczenie odwarstwienia płytki paznokciowej",
                120.00,
                45,
                "Usługi dodatkowe",
            ),
        ]

        for name, description, price, duration, category_name in starter_services:
            service = Service()
            service.name = name
            service.description = description
            service.price = price
            service.duration_minutes = duration
            service.category_id = category_map[category_name].id
            db.session.add(service)

        db.session.commit()


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, "index.html")
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, "index.html")
        else:
            return "index.html not found", 404


if __name__ == "__main__":
    debug_env = os.environ.get("DEBUG", "True")
    debug_bool = str(debug_env).lower() in ("1", "true", "yes")
    app.run(
        host=os.environ.get("HOST", "0.0.0.0"),
        port=int(os.environ.get("PORT", 5000)),
        debug=debug_bool,
    )
