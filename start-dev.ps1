Write-Host "🏥 Uruchamianie aplikacji podologicznej..." -ForegroundColor Green
Write-Host "=" * 50

# Sprawdzenie czy jesteśmy w odpowiednim folderze
if (-not (Test-Path ".\frontend\package.json") -or -not (Test-Path ".\backend\app.py")) {
    Write-Host "❌ Błąd: Nie znaleziono plików aplikacji. Upewnij się, że jesteś w głównym folderze projektu." -ForegroundColor Red
    exit 1
}

# Sprawdzenie czy Node.js jest zainstalowany
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd: Node.js nie jest zainstalowany lub niedostępny w PATH." -ForegroundColor Red
    exit 1
}

# Sprawdzenie czy Python jest zainstalowany
try {
    $pythonVersion = python --version
    Write-Host "✅ Python: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Błąd: Python nie jest zainstalowany lub niedostępny w PATH." -ForegroundColor Red
    exit 1
}

# Sprawdzenie wirtualnego środowiska Pythona
if (-not (Test-Path ".venv\Scripts\Activate.ps1")) {
    Write-Host "❌ Błąd: Nie znaleziono wirtualnego środowiska Python w .venv\" -ForegroundColor Red
    Write-Host "💡 Wskazówka: Utwórz wirtualne środowisko poleceniem:" -ForegroundColor Yellow
    Write-Host "   python -m venv .venv" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Uruchamianie serwerów..." -ForegroundColor Cyan

# Funkcja do uruchamiania backendu
$backendJob = Start-Job -ScriptBlock {
    param($projectPath)
    Set-Location $projectPath
    Set-Location "backend"
    
    # Aktywacja środowiska wirtualnego
    & ".venv\\Scripts\\Activate.ps1"
    
    # Sprawdzenie czy wszystkie zależności są zainstalowane
    try {
        python -c "import flask, flask_sqlalchemy, flask_cors" 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "📦 Instalowanie zależności Python..." -ForegroundColor Yellow
            pip install -r requirements.txt
        }
    } catch {
        Write-Host "📦 Instalowanie zależności Python..." -ForegroundColor Yellow
        pip install -r requirements.txt
    }
    
    Write-Host "🐍 Uruchamianie backend Flask na porcie 5000..." -ForegroundColor Blue
    python app.py
} -ArgumentList (Get-Location).Path

# Funkcja do uruchamiania frontendu
$frontendJob = Start-Job -ScriptBlock {
    param($projectPath)
    Set-Location $projectPath
    Set-Location "frontend"
    
    # Sprawdzenie czy node_modules istnieją
    if (-not (Test-Path ".\node_modules")) {
        Write-Host "📦 Instalowanie zależności npm..." -ForegroundColor Yellow
        npm install
    }
    
    Write-Host "⚛️  Uruchamianie frontend Vite na porcie 5173..." -ForegroundColor Blue
    npm run dev
} -ArgumentList (Get-Location).Path

# Poczekaj chwilę na uruchomienie
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🌐 Aplikacja uruchomiona!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Dostępne komendy:" -ForegroundColor Yellow
Write-Host "  [S] - Status serwerów"
Write-Host "  [O] - Otwórz w przeglądarce"
Write-Host "  [L] - Pokaż logi"
Write-Host "  [Q] - Zakończ wszystkie serwery"
Write-Host ""

# Główna pętla zarządzania
do {
    $key = Read-Host "Wybierz opcję [S/O/L/Q]"
    
    switch ($key.ToUpper()) {
        'S' {
            Write-Host ""
            Write-Host "📊 Status serwerów:" -ForegroundColor Cyan
            
            $backendState = $backendJob.State
            $frontendState = $frontendJob.State
            
            if ($backendState -eq "Running") {
                Write-Host "  🐍 Backend Flask: ✅ Uruchomiony" -ForegroundColor Green
            } else {
                Write-Host "  🐍 Backend Flask: ❌ $backendState" -ForegroundColor Red
            }
            
            if ($frontendState -eq "Running") {
                Write-Host "  ⚛️  Frontend Vite: ✅ Uruchomiony" -ForegroundColor Green
            } else {
                Write-Host "  ⚛️  Frontend Vite: ❌ $frontendState" -ForegroundColor Red
            }
            Write-Host ""
        }
        'O' {
            Write-Host "🌐 Otwieranie aplikacji w przeglądarce..." -ForegroundColor Cyan
            Start-Process "http://localhost:5173"
        }
        'L' {
            Write-Host ""
            Write-Host "📋 Ostatnie logi backendu:" -ForegroundColor Yellow
            Receive-Job $backendJob | Select-Object -Last 10
            Write-Host ""
            Write-Host "📋 Ostatnie logi frontendu:" -ForegroundColor Yellow  
            Receive-Job $frontendJob | Select-Object -Last 10
            Write-Host ""
        }
        'Q' {
            Write-Host ""
            Write-Host "🛑 Zatrzymywanie serwerów..." -ForegroundColor Red
            
            # Zatrzymaj joby
            Stop-Job $backendJob -ErrorAction SilentlyContinue
            Stop-Job $frontendJob -ErrorAction SilentlyContinue
            
            # Usuń joby
            Remove-Job $backendJob -ErrorAction SilentlyContinue
            Remove-Job $frontendJob -ErrorAction SilentlyContinue
            
            # Dodatkowe zabijanie procesów na portach (na wypadek gdyby joby nie wyczyściły wszystkiego)
            try {
                $process5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
                if ($process5000) {
                    Stop-Process -Id $process5000 -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ Zatrzymano proces na porcie 5000" -ForegroundColor Green
                }
            } catch {
                # Port może nie być używany
            }
            
            try {
                $process5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess
                if ($process5173) {
                    Stop-Process -Id $process5173 -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ Zatrzymano proces na porcie 5173" -ForegroundColor Green
                }
            } catch {
                # Port może nie być używany
            }
            
            Write-Host "👋 Aplikacja została zatrzymana. Miłego dnia!" -ForegroundColor Green
            break
        }
        default {
            Write-Host "❌ Nieprawidłowa opcja. Wybierz S, O, L lub Q." -ForegroundColor Red
        }
    }
} while ($true)