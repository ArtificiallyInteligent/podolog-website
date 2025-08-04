<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Instrukcje dla GitHub Copilot

## Opis projektu
To jest zintegrowana aplikacja webowa dla gabinetu podologicznego, składająca się z:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion + Lucide Icons
- **Backend**: Flask + SQLAlchemy + SQLite + Flask-CORS

## Struktura projektu
```
/
├── src/                    # Frontend React
├── backend/               # Backend Flask
│   ├── app.py            # Główna aplikacja Flask
│   ├── requirements.txt  # Zależności Python
│   └── .env             # Zmienne środowiskowe
├── public/               # Statyczne pliki frontend
└── package.json         # Zależności Node.js
```

## Zasady kodowania

### Frontend (React + TypeScript)
- Używaj TypeScript dla wszystkich komponentów
- Używaj Tailwind CSS do stylowania
- Używaj Framer Motion do animacji
- Używaj Lucide Icons do ikon
- Komponenty funkcyjne z hookami
- Responsive design (mobile-first)
- Komunikacja z backend przez fetch API na porcie 5000

### Backend (Flask + Python)
- Używaj Flask-SQLAlchemy do modeli bazy danych
- Wszystkie endpointy API pod prefiksem `/api/`
- Używaj Flask-CORS dla komunikacji z frontend
- Zwracaj dane w formacie JSON
- Obsługa błędów z odpowiednimi kodami HTTP
- SQLite jako baza danych

## Konwencje nazewnictwa
- **Komponenty React**: PascalCase (np. `PatientList.tsx`)
- **Pliki Python**: snake_case (np. `patient_model.py`)
- **API endpointy**: snake_case (np. `/api/get_patients`)
- **Klasy CSS**: kebab-case + Tailwind utilities

## Funkcjonalności aplikacji
- Zarządzanie pacjentami (CRUD)
- Zarządzanie wizytami (CRUD)
- Dashboard z statystykami
- Responsywny interfejs użytkownika
- Animacje i przejścia

## Porty i URLs
- Frontend (Vite dev server): http://localhost:5173
- Backend (Flask): http://localhost:5000
- API endpoints: http://localhost:5000/api/*

## Baza danych
- SQLite (plik `backend/database.db`)
- Modele: Patient, Appointment
- Relacje: Patient -> many Appointments
