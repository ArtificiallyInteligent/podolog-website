# README - Skrypty zarządzania aplikacją podologiczną

## 🚀 ```

podolog-website/
├── .venv/ # 🐍 Wirtualne środowisko Python
├── start-dev.ps1 # 🚀 Skrypt uruchamiający
├── stop-dev.ps1 # 🛑 Skrypt zatrzymujący
├── README-SCRIPTS.md # 📚 Ten plik
├── frontend/ # ⚛️ Aplikacja React
│ ├── src/
│ ├── package.json
│ └── vite.config.ts
└── backend/ # 🐍 API Flask
├── app.py
├── requirements.txt
└── src/

````
### Uruchamianie aplikacji

```powershell
.\start-dev.ps1
````

### Zatrzymywanie aplikacji

```powershell
.\stop-dev.ps1
```

## 📋 Wymagania systemowe

- **Node.js** (v16 lub nowszy)
- **Python** (v3.8 lub nowszy)
- **PowerShell** (v5.1 lub nowszy)
- **Wirtualne środowisko Python** w folderze `.venv\` (w głównym folderze projektu)

## 🛠️ Pierwsze uruchomienie

1. **Utworzenie wirtualnego środowiska Python:**

   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r backend\requirements.txt
   ```

2. **Instalacja zależności Node.js:**

   ```powershell
   cd frontend
   npm install
   cd ..
   ```

3. **Uruchomienie aplikacji:**
   ```powershell
   .\start-dev.ps1
   ```

## 🎮 Komendy dostępne w start-dev.ps1

Po uruchomieniu `start-dev.ps1` masz dostęp do następujących komend:

- **[S]** - Status serwerów - sprawdza czy backend i frontend działają
- **[O]** - Otwórz w przeglądarce - automatycznie otwiera http://localhost:5173
- **[L]** - Pokaż logi - wyświetla ostatnie logi z backendu i frontendu
- **[Q]** - Zakończ wszystkie serwery - bezpiecznie zatrzymuje aplikację

## 🌐 Adresy aplikacji

- **Frontend (React + Vite):** http://localhost:5173
- **Backend (Flask API):** http://localhost:5000
- **Panel administracyjny:** http://localhost:5173/admin

## 📂 Struktura projektu

```
podolog-website/
├── start-dev.ps1          # 🚀 Skrypt uruchamiający
├── stop-dev.ps1           # 🛑 Skrypt zatrzymujący
├── README-SCRIPTS.md      # 📖 Ten plik
├── frontend/              # ⚛️ Aplikacja React
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── backend/               # 🐍 API Flask
    ├── .venv/            # Wirtualne środowisko Python
    ├── app.py
    ├── requirements.txt
    └── src/
```

## 🔧 Rozwiązywanie problemów

### ❌ "Nie można odnaleźć wirtualnego środowiska"

```powershell
python -m venv .venv
```

### ❌ "Port jest już zajęty"

```powershell
.\stop-dev.ps1  # Zatrzyma wszystkie procesy
.\start-dev.ps1 # Uruchomi ponownie
```

### ❌ "Node.js nie jest zainstalowany"

Pobierz i zainstaluj Node.js z https://nodejs.org/

### ❌ "Python nie jest zainstalowany"

Pobierz i zainstaluj Python z https://python.org/

### ❌ Problemy z PowerShell Execution Policy

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 🔒 Bezpieczeństwo

- Skrypty automatycznie sprawdzają czy jesteś we właściwym folderze projektu
- Wirtualne środowisko Python jest izolowane
- Procesy są bezpiecznie zatrzymywane przy wyjściu
- Porty są automatycznie zwalniane

## 📝 Uwagi

- Przy pierwszym uruchomieniu skrypty automatycznie zainstalują brakujące zależności
- Backend automatycznie aktywuje wirtualne środowisko Python
- Frontend uruchamia się w trybie deweloperskim z hot-reload
- Wszystkie logi są dostępne w czasie rzeczywistym

## 🆘 Pomoc

Jeśli masz problemy:

1. Sprawdź czy wszystkie wymagania są spełnione
2. Uruchom `.\stop-dev.ps1` aby wyczyścić procesy
3. Spróbuj ponownie z `.\start-dev.ps1`
4. Sprawdź logi używając opcji [L] w menu
