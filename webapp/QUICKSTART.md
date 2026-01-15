# Szybki Start - Aplikacja Webowa

Ten przewodnik pomoże Ci szybko uruchomić aplikację webową do zarządzania instrumentami finansowymi.

## Wymagania wstępne

- Node.js 16 lub nowszy (sprawdź: `node --version`)
- Dostęp do systemu IBM i z zainstalowanym ODBC
- Skonfigurowany DSN dla połączenia z IBM i

## Krok 1: Instalacja zależności

### Backend:
```bash
cd webapp/backend
npm install
```

### Frontend:
```bash
cd webapp/frontend
npm install
```

## Krok 2: Konfiguracja połączenia z bazą danych

Skopiuj plik przykładowej konfiguracji:

```bash
cd webapp/backend
cp .env.example .env
```

Edytuj plik `.env` i wprowadź dane połączenia z IBM i:

```env
DB_CONNECTION_STRING=DSN=YOUR_DSN;UID=YOUR_USER;PWD=YOUR_PASSWORD
PORT=3001
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

**Ważne:** Zastąp `YOUR_DSN`, `YOUR_USER`, i `YOUR_PASSWORD` rzeczywistymi danymi.

## Krok 3: Uruchomienie aplikacji

Otwórz **dwa terminale**:

### Terminal 1 - Backend:
```bash
cd webapp/backend
npm start
```

Powinieneś zobaczyć:
```
Database connection established
Server running on port 3001
API available at: http://localhost:3001/api/instruments
```

### Terminal 2 - Frontend:
```bash
cd webapp/frontend
npm run dev
```

Powinieneś zobaczyć:
```
  VITE v5.0.2  ready in 234 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

## Krok 4: Otwórz aplikację

Otwórz przeglądarkę i przejdź do: **http://localhost:3000**

## Testowanie

### Dodaj pierwszy instrument:

1. Kliknij przycisk **"Dodaj instrument"**
2. Wypełnij formularz:
   - **ISIN**: PLTEST123456
   - **Nazwa krótka**: Test Instrument
   - **Emitent**: Test Company
   - **Data emisji**: wybierz dowolną datę
   - **Kraj**: PL
   - **Waluta**: PLN
   - **Wielkość emisji**: 1000000
3. Kliknij **"Dodaj"**

### Edycja instrumentu:

1. Kliknij ikonę **ołówka** przy instrumencie
2. Zmień dane
3. Kliknij **"Zapisz zmiany"**

### Usunięcie instrumentu:

1. Kliknij ikonę **kosza** przy instrumencie
2. Potwierdź usunięcie

## Rozwiązywanie problemów

### Problem: "Database connection failed"

**Rozwiązanie:**
- Sprawdź czy DSN jest poprawnie skonfigurowany
- Zweryfikuj dane logowania (user/password)
- Upewnij się, że ODBC driver jest zainstalowany
- Sprawdź czy biblioteka z tabelą INSTPF jest dostępna

### Problem: "Cannot connect to backend"

**Rozwiązanie:**
- Sprawdź czy backend działa (Terminal 1)
- Upewnij się że backend nasłuchuje na porcie 3001
- Sprawdź czy w konsoli przeglądarki (F12) nie ma błędów CORS

### Problem: Frontend pokazuje błąd kompilacji

**Rozwiązanie:**
- Usuń `node_modules` i zainstaluj ponownie: `rm -rf node_modules && npm install`
- Sprawdź wersję Node.js: `node --version` (powinna być >= 16)

## Następne kroki

- Przeczytaj pełną dokumentację w [README.md](README.md)
- Skonfiguruj aplikację dla środowiska produkcyjnego
- Dodaj autentykację użytkowników (jeśli potrzebna)
- Dostosuj interfejs do swoich potrzeb

## Zatrzymanie aplikacji

Aby zatrzymać aplikację:
- W obu terminalach naciśnij `Ctrl+C`

## Pomoc

Jeśli masz problemy:
1. Sprawdź logi w terminalu backendu
2. Sprawdź konsolę przeglądarki (F12)
3. Przeczytaj sekcję "Rozwiązywanie problemów" w README.md
