# Skrypt PowerShell do zatrzymywania aplikacji podologicznej
# Autor: GitHub Copilot
# Data: 30 września 2025

Write-Host "🛑 Zatrzymywanie aplikacji podologicznej..." -ForegroundColor Red
Write-Host "=" * 50

# Funkcja do zabijania procesu na określonym porcie
function Stop-ProcessOnPort {
    param([int]$Port, [string]$ServiceName)
    
    try {
        $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
        
        if ($processes) {
            foreach ($processId in $processes) {
                $processInfo = Get-Process -Id $processId -ErrorAction SilentlyContinue
                if ($processInfo) {
                    Write-Host "🔄 Zatrzymywanie $ServiceName (PID: $processId, Process: $($processInfo.ProcessName))" -ForegroundColor Yellow
                    Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
                    Write-Host "✅ $ServiceName zatrzymany" -ForegroundColor Green
                }
            }
        } else {
            Write-Host "ℹ️  $ServiceName nie jest uruchomiony na porcie $Port" -ForegroundColor Gray
        }
    } catch {
        Write-Host "ℹ️  Nie znaleziono procesów na porcie $Port dla $ServiceName" -ForegroundColor Gray
    }
}

# Zatrzymaj procesy Node.js (Frontend Vite)
Write-Host "🔍 Szukanie procesów Frontend (Vite)..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 5173 -ServiceName "Frontend (Vite)"

# Dodatkowo zabij wszystkie procesy node.js związane z vite
try {
    $viteProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like "*vite*" -or $_.MainWindowTitle -like "*vite*"
    }
    
    foreach ($process in $viteProcesses) {
        Write-Host "🔄 Zatrzymywanie procesu Vite (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
} catch {
    # Brak procesów Vite
}

# Zatrzymaj procesy Python (Backend Flask)
Write-Host "🔍 Szukanie procesów Backend (Flask)..." -ForegroundColor Cyan
Stop-ProcessOnPort -Port 5000 -ServiceName "Backend (Flask)"

# Dodatkowo zabij wszystkie procesy python.exe związane z flask lub app.py
try {
    $flaskProcesses = Get-Process -Name "python" -ErrorAction SilentlyContinue | Where-Object { 
        $_.CommandLine -like "*app.py*" -or $_.CommandLine -like "*flask*"
    }
    
    foreach ($process in $flaskProcesses) {
        Write-Host "🔄 Zatrzymywanie procesu Flask (PID: $($process.Id))" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force -ErrorAction SilentlyContinue
    }
} catch {
    # Brak procesów Flask
}

# Zatrzymaj wszystkie joby PowerShell w tle (na wypadek gdyby były uruchomione przez start-dev.ps1)
Write-Host "🔍 Czyszczenie jobów PowerShell..." -ForegroundColor Cyan
$jobs = Get-Job -ErrorAction SilentlyContinue

if ($jobs) {
    foreach ($job in $jobs) {
        Write-Host "🔄 Zatrzymywanie job: $($job.Name) (ID: $($job.Id))" -ForegroundColor Yellow
        Stop-Job $job -ErrorAction SilentlyContinue
        Remove-Job $job -Force -ErrorAction SilentlyContinue
    }
    Write-Host "✅ Wszystkie joby PowerShell zostały wyczyszczone" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Brak aktywnych jobów PowerShell" -ForegroundColor Gray
}

# Sprawdź czy porty są rzeczywiście wolne
Write-Host ""
Write-Host "🔍 Sprawdzanie statusu portów..." -ForegroundColor Cyan

$port5173 = Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue
$port5000 = Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue

if (-not $port5173) {
    Write-Host "✅ Port 5173 (Frontend) jest wolny" -ForegroundColor Green
} else {
    Write-Host "⚠️  Port 5173 (Frontend) nadal jest zajęty" -ForegroundColor Yellow
}

if (-not $port5000) {
    Write-Host "✅ Port 5000 (Backend) jest wolny" -ForegroundColor Green
} else {
    Write-Host "⚠️  Port 5000 (Backend) nadal jest zajęty" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Proces zatrzymywania aplikacji zakończony!" -ForegroundColor Green
Write-Host "💡 Możesz teraz bezpiecznie uruchomić aplikację ponownie używając .\start-dev.ps1" -ForegroundColor Cyan

# Opcjonalnie poczekaj na naciśnięcie klawisza
Write-Host ""
Read-Host "Naciśnij Enter, aby zakończyć"