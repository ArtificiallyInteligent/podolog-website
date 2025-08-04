# Skrypty do zarządzania wirtualnym środowiskiem Python

## Windows (PowerShell)

### Aktywacja wirtualnego środowiska
.\venv\Scripts\Activate.ps1

### Deaktywacja wirtualnego środowiska
deactivate

### Instalacja zależności w aktywnym środowisku
pip install -r requirements.txt

### Aktualizacja requirements.txt
pip freeze > requirements.txt

## Linux/macOS (Bash)

### Aktywacja wirtualnego środowiska
source venv/bin/activate

### Deaktywacja wirtualnego środowiska
deactivate

### Instalacja zależności w aktywnym środowisku
pip install -r requirements.txt

### Aktualizacja requirements.txt
pip freeze > requirements.txt

## Notatki
- Wirtualne środowisko jest tworzone w folderze backend/venv/
- Folder venv/ powinien być dodany do .gitignore
- Zawsze aktywuj wirtualne środowisko przed pracą z backend
