# System Zarządzania Gabinetem Podologicznym

Zintegrowana aplikacja webowa do zarządzania gabinetem podologicznym, łącząca nowoczesny frontend React z backend Flask.

## 🚀 Technologie

### Frontend
- **React 18** - nowoczesny framework JavaScript
- **TypeScript** - typowanie statyczne
- **Vite** - szybki bundler i dev server
- **Tailwind CSS** - utility-first CSS framework
- **Framer Motion** - animacje i przejścia
- **Lucide Icons** - nowoczesne ikony SVG

### Backend
- **Flask** - lekki framework Python
- **SQLAlchemy** - ORM do zarządzania bazą danych
- **Flask-CORS** - obsługa cross-origin requests
- **SQLite** - lekka baza danych

## 📁 Struktura projektu

```
podolog-website/
├── src/                    # Frontend React
│   ├── App.tsx            # Główny komponent aplikacji
│   ├── index.css          # Style Tailwind CSS
│   └── main.tsx           # Punkt wejścia aplikacji
├── backend/               # Backend Flask
│   ├── app.py            # Główna aplikacja Flask
│   ├── requirements.txt  # Zależności Python
│   ├── .env             # Zmienne środowiskowe
│   └── database.db      # Baza danych SQLite (tworzona automatycznie)
├── public/               # Statyczne pliki
├── .github/              # Konfiguracja GitHub
│   └── copilot-instructions.md
└── package.json         # Zależności Node.js
```

## 🛠️ Instalacja i uruchomienie

### Wymagania
- Node.js (v16 lub nowszy)
- Python 3.8+
- npm lub yarn

### 1. Klonowanie repozytorium
```bash
git clone <repo-url>
cd podolog-website
```

### 2. Instalacja zależności frontend
```bash
npm install
```

### 3. Instalacja zależności backend
```bash
cd backend
pip install -r requirements.txt
```

### 4. Uruchomienie aplikacji

#### Frontend (Terminal 1)
```bash
npm run dev
```
Aplikacja będzie dostępna pod: http://localhost:5173

#### Backend (Terminal 2)
```bash
cd backend
python app.py
```
API będzie dostępne pod: http://localhost:5000

## 📊 Funkcjonalności

- ✅ Dashboard z statystykami gabinetu
- ✅ Zarządzanie pacjentami (dodawanie, wyświetlanie)
- ✅ Zarządzanie wizytami (planowanie, śledzenie statusu)
- ✅ Responsywny interfejs użytkownika
- ✅ Animowane przejścia i interakcje
- ✅ REST API z automatyczną dokumentacją
- ✅ Baza danych SQLite z przykładowymi danymi

## 🔌 API Endpoints

### Sprawdzenie statusu
- `GET /api/health` - sprawdzenie działania API

### Pacjenci
- `GET /api/patients` - lista wszystkich pacjentów
- `POST /api/patients` - dodanie nowego pacjenta

### Wizyty
- `GET /api/appointments` - lista wszystkich wizyt
- `POST /api/appointments` - dodanie nowej wizyty

## 🎨 Konfiguracja

### Frontend
- Vite konfiguracja: `vite.config.ts`
- Tailwind CSS: konfiguracja w `vite.config.ts` (używa @tailwindcss/vite)
- TypeScript: `tsconfig.json`

### Backend
- Flask konfiguracja: `backend/app.py`
- Zmienne środowiskowe: `backend/.env`
- Baza danych: SQLite (automatycznie tworzona przy pierwszym uruchomieniu)

## 🧪 Rozwój

### Dodawanie nowych komponentów frontend
```bash
# Komponenty umieszczaj w folderze src/components/
mkdir src/components
```

### Dodawanie nowych modeli backend
```python
# Modele dodawaj w app.py lub osobnych plikach
class NewModel(db.Model):
    # definicja modelu
```

### Hot Reload
- Frontend: automatyczny reload podczas edycji plików
- Backend: Flask debug mode automatycznie restartuje serwer

## 📝 Skrypty npm

- `npm run dev` - uruchomienie dev server
- `npm run build` - budowanie aplikacji produkcyjnej
- `npm run preview` - podgląd zbudowanej aplikacji
- `npm run lint` - sprawdzenie jakości kodu

## 🤝 Współpraca

1. Fork repozytorium
2. Utwórz branch dla swojej funkcjonalności
3. Commituj zmiany
4. Utwórz Pull Request

## 📄 Licencja

MIT License