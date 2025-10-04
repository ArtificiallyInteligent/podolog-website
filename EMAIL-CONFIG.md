# Konfiguracja powiadomień email

## 📧 Funkcjonalność

System automatycznie wysyła powiadomienia email gdy:

- Pacjent wypełni formularz rezerwacji na stronie
- Email zostanie wysłany na adres skonfigurowany w panelu administratora
- Email zawiera wszystkie szczegóły rezerwacji

## 🚀 Szybki start

### 1. Uruchom migrację bazy danych

```powershell
cd backend
python migrate_settings.py
```

### 2. Skonfiguruj Gmail

1. Przejdź do [Google Account Security](https://myaccount.google.com/security)
2. Włącz **weryfikację dwuetapową** (2-Step Verification)
3. Przejdź do **Hasła aplikacji** (App Passwords)
4. Wybierz "Poczta" i "Inne urządzenie"
5. Wygeneruj hasło (otrzymasz 16-znakowy kod)
6. Zapisz to hasło - użyjesz go w panelu administratora

### 3. Skonfiguruj w panelu administratora

1. Uruchom aplikację i przejdź do panelu administratora
2. Kliknij **"Ustawienia"** w menu bocznym
3. Wypełnij formularz:
   - **Email odbiorcy powiadomień**: adres, na który mają przychodzić rezerwacje
   - **Nazwa gabinetu**: np. "Gabinet Podologiczny Dr. Kowalski"
   - **Email Gmail (nadawca)**: twój adres Gmail (np. gabinet@gmail.com)
   - **Hasło aplikacji Gmail**: wygenerowane 16-znakowe hasło
4. Kliknij **"Zapisz ustawienia"**

### 4. Testowanie

1. Wypełnij formularz rezerwacji na stronie
2. Sprawdź czy email przyszedł na skonfigurowany adres
3. W przypadku problemów sprawdź logi backendu

## ⚙️ Alternatywna konfiguracja (zmienne środowiskowe)

Możesz również skonfigurować dane przez zmienne środowiskowe:

### Backend/.env

```bash
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=true
MAIL_USERNAME=twoj-email@gmail.com
MAIL_PASSWORD=haslo-aplikacji-gmail
MAIL_DEFAULT_SENDER=twoj-email@gmail.com
```

**Uwaga**: Ustawienia z panelu administratora mają priorytet nad zmiennymi środowiskowymi!

## 🔒 Bezpieczeństwo

### ⚠️ WAŻNE!

- **NIE używaj** zwykłego hasła Gmail - tylko hasło aplikacji!
- **NIE commituj** pliku .env do repozytorium
- Hasła aplikacji są bezpieczniejsze i można je łatwo odwołać
- Dodaj `.env` do `.gitignore`

### Dlaczego hasło aplikacji?

- Google wymaga hasła aplikacji gdy 2FA jest włączone
- Hasła aplikacji są bezpieczniejsze niż zwykłe hasła
- Można je odwołać bez zmiany głównego hasła
- Dają dostęp tylko do wybranej usługi (np. poczta)

## 📨 Format emaila

Email zawiera:

- ✅ Imię i nazwisko pacjenta
- ✅ Adres email kontaktowy
- ✅ Numer telefonu (jeśli podany)
- ✅ Wybraną usługę
- ✅ Datę i godzinę wizyty
- ✅ Dodatkową wiadomość (jeśli podana)
- ✅ Status rezerwacji (zawsze "Oczekuje potwierdzenia")

Email jest sformatowany w HTML z profesjonalnym designem.

## 🐛 Rozwiązywanie problemów

### Email nie został wysłany

1. **Sprawdź logi backendu** - poszukaj błędów w terminalu
2. **Zweryfikuj hasło aplikacji** - upewnij się, że nie ma spacji
3. **Sprawdź ustawienia Gmail**:
   - Czy 2FA jest włączone?
   - Czy hasło aplikacji jest aktualne?
   - Czy email nie jest zablokowany przez Google?
4. **Sprawdź konfigurację** w panelu administratora

### "Błąd podczas wysyłania emaila"

- Sprawdź czy MAIL_USERNAME i MAIL_PASSWORD są wypełnione
- Upewnij się, że używasz hasła aplikacji, nie zwykłego hasła
- Sprawdź czy masz połączenie z internetem
- Sprawdź czy Gmail nie zablokował dostępu

### "Brak skonfigurowanego adresu email"

- Przejdź do panelu administratora → Ustawienia
- Wypełnij pole "Email odbiorcy powiadomień"
- Zapisz ustawienia

## 📝 Struktura kodu

- `backend/src/models/settings.py` - model ustawień w bazie danych
- `backend/src/routes/settings.py` - API endpointy dla ustawień
- `backend/src/utils/email_utils.py` - funkcje wysyłania emaili
- `backend/src/routes/appointment.py` - integracja z tworzeniem rezerwacji
- `frontend/src/pages/AdminDashboard.tsx` - UI sekcji ustawień

## 🔄 Aktualizacja ustawień

Ustawienia można zmieniać w dowolnym momencie przez panel administratora.
Zmiany są natychmiastowe - nie wymaga restartu aplikacji.

## 📚 Więcej informacji

- [Gmail App Passwords Documentation](https://support.google.com/accounts/answer/185833)
- [Flask-Mail Documentation](https://pythonhosted.org/Flask-Mail/)
