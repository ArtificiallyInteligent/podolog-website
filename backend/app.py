import os
import sys

# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models import Service, ServiceCategory, db
from src.routes.user import user_bp
from src.routes.appointment import appointment_bp
from src.routes.service import service_bp
from src.routes.admin import admin_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), "static"))
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY", "a-very-secret-dev-key")

# Włączenie CORS dla wszystkich tras
CORS(app)

app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(appointment_bp, url_prefix="/api")
app.register_blueprint(service_bp, url_prefix="/api")
app.register_blueprint(admin_bp, url_prefix="/api")

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

        starter_services = [
            (
                "Konsultacja podologiczna",
                "Kompleksowy wywiad i plan terapii dopasowany do pacjenta",
                120.00,
                45,
                "Podstawowe zabiegi",
            ),
            (
                "Podstawowy zabieg podologiczny",
                "Usuwanie zrogowaceń, opracowanie paznokci oraz nawilżenie stóp",
                180.00,
                75,
                "Podstawowe zabiegi",
            ),
            (
                "Usuwanie odcisków i modzeli",
                "Precyzyjne usuwanie zmian rogowych z zastosowaniem narzędzi podologicznych",
                150.00,
                50,
                "Zabiegi specjalistyczne",
            ),
            (
                "Leczenie wrastających paznokci",
                "Zakładanie klamer ortonyksyjnych oraz odciążanie wałów paznokciowych",
                240.00,
                60,
                "Korekcja i ortopedia",
            ),
            (
                "Taping (kinesiotaping) stóp",
                "Stabilizacja i wspomaganie pracy mięśni oraz powięzi",
                90.00,
                30,
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
