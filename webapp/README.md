# Aplikacja Webowa - Słownik Instrumentów Finansowych

Aplikacja webowa do zarządzania słownikiem instrumentów finansowych jako alternatywa dla programu 5250 INSTMGR.

## Struktura projektu

```
webapp/
├── backend/          # Node.js REST API
│   ├── controllers/  # Kontrolery API
│   ├── routes/       # Definicje ścieżek API
│   ├── db.js        # Połączenie z bazą danych
│   ├── server.js    # Główny plik serwera
│   └── package.json
└── frontend/         # React + Material-UI
    ├── src/
    │   ├── api/           # Klient API
    │   ├── components/    # Komponenty React
    │   ├── App.jsx        # Główny komponent
    │   └── main.jsx       # Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Funkcjonalność

Aplikacja oferuje pełny CRUD (Create, Read, Update, Delete) dla instrumentów finansowych:

- **Przeglądanie** - Lista wszystkich instrumentów w formie tabelarycznej
- **Dodawanie** - Formularz dodawania nowych instrumentów
- **Edycja** - Formularz edycji istniejących instrumentów
- **Usuwanie** - Usuwanie instrumentów z potwierdzeniem
- **Walidacja** - Walidacja danych po stronie frontendu i backendu

### Pola instrumentu:
- **ISIN** (12 znaków) - Kod ISIN instrumentu (klucz główny)
- **Nazwa krótka** (40 znaków) - Krótka nazwa instrumentu
- **Emitent** (60 znaków) - Nazwa emitenta
- **Data emisji** - Data emisji instrumentu
- **Kraj** (2 znaki) - Kod kraju ISO (np. PL, US)
- **Waluta** (3 znaki) - Kod waluty ISO (np. PLN, USD)
- **Wielkość emisji** (liczba) - Wielkość emisji

## Wymagania

### Backend:
- Node.js 16+
- Dostęp do IBM i przez ODBC
- ODBC Driver dla IBM i

### Frontend:
- Node.js 16+
- Nowoczesna przeglądarka (Chrome, Firefox, Safari, Edge)

## Instalacja

### 1. Konfiguracja ODBC na IBM i

Upewnij się, że masz skonfigurowany DSN (Data Source Name) dla połączenia z IBM i.

Przykładowy wpis w `/etc/odbc.ini`:

```ini
[IBMI_DSN]
Description = IBM i System
Driver = IBM i Access ODBC Driver
System = your-ibmi-host
UserID = your-username
Password = your-password
Naming = 1
DefaultLibraries = YOURLIB
```

### 2. Backend

```bash
cd webapp/backend

# Zainstaluj zależności
npm install

# Skopiuj i skonfiguruj plik .env
cp .env.example .env
nano .env
```

Edytuj plik `.env`:

```env
# Połączenie z IBM i
DB_CONNECTION_STRING=DSN=IBMI_DSN;UID=username;PWD=password

# lub alternatywnie:
DB_HOST=your-ibmi-host
DB_USER=your-username
DB_PASSWORD=your-password
DB_DATABASE=YOURLIB

# Port serwera
PORT=3001

# Środowisko
NODE_ENV=development

# CORS - dozwolone pochodzenia
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 3. Frontend

```bash
cd webapp/frontend

# Zainstaluj zależności
npm install

# Opcjonalnie skopiuj i skonfiguruj .env (jeśli API nie jest na localhost:3001)
cp .env.example .env
nano .env
```

Edytuj plik `.env` (opcjonalnie):

```env
VITE_API_URL=http://localhost:3001/api
```

## Uruchomienie

### Backend (Terminal 1):

```bash
cd webapp/backend
npm start

# lub w trybie developerskim z auto-restartem:
npm run dev
```

Serwer będzie dostępny na `http://localhost:3001`

API endpoints:
- `GET /api/instruments` - Lista wszystkich instrumentów
- `GET /api/instruments/:isin` - Pobierz instrument po ISIN
- `POST /api/instruments` - Dodaj nowy instrument
- `PUT /api/instruments/:isin` - Zaktualizuj instrument
- `DELETE /api/instruments/:isin` - Usuń instrument

### Frontend (Terminal 2):

```bash
cd webapp/frontend
npm run dev
```

Aplikacja będzie dostępna na `http://localhost:3000`

## Testowanie API

Możesz przetestować API używając curl:

```bash
# Lista instrumentów
curl http://localhost:3001/api/instruments

# Dodaj instrument
curl -X POST http://localhost:3001/api/instruments \
  -H "Content-Type: application/json" \
  -d '{
    "isin": "PLTEST123456",
    "shortName": "Test Instrument",
    "emitent": "Test Emitent",
    "issueDate": "2024-01-15",
    "country": "PL",
    "currency": "PLN",
    "issueSize": 1000000.00
  }'

# Pobierz instrument
curl http://localhost:3001/api/instruments/PLTEST123456

# Aktualizuj instrument
curl -X PUT http://localhost:3001/api/instruments/PLTEST123456 \
  -H "Content-Type: application/json" \
  -d '{
    "shortName": "Updated Name",
    "emitent": "Test Emitent",
    "issueDate": "2024-01-15",
    "country": "PL",
    "currency": "PLN",
    "issueSize": 2000000.00
  }'

# Usuń instrument
curl -X DELETE http://localhost:3001/api/instruments/PLTEST123456
```

## Build produkcyjny

### Frontend:

```bash
cd webapp/frontend
npm run build
```

Zbudowane pliki będą w katalogu `dist/`. Możesz je podać przez dowolny serwer HTTP (nginx, Apache, etc.)

### Backend:

Backend nie wymaga budowania - możesz go uruchomić bezpośrednio na serwerze produkcyjnym używając:

```bash
NODE_ENV=production npm start
```

## Wdrożenie produkcyjne

### Opcja 1: Aplikacja na tym samym serwerze co IBM i

1. Zainstaluj Node.js na IBM i (lub serwerze z dostępem do IBM i)
2. Skonfiguruj połączenie ODBC lokalnie
3. Uruchom backend jako usługę systemową
4. Zbuduj frontend i podaj przez HTTP server (nginx/Apache)

### Opcja 2: Backend na IBM i, Frontend na osobnym serwerze

1. Backend uruchom na IBM i lub serwerze z dostępem do IBM i
2. Frontend zbuduj i wdróż na dowolnym serwerze WWW
3. Skonfiguruj CORS w backendzie aby zezwolić na połączenia z domeny frontendu

### Opcja 3: Wszystko w kontenerach Docker

Backend i frontend można skonteneryzować używając Docker i wdrożyć na dowolnej platformie chmurowej.

## Bezpieczeństwo

W środowisku produkcyjnym rozważ:

1. **HTTPS** - Użyj certyfikatów SSL/TLS
2. **Autentykacja** - Dodaj mechanizm logowania (JWT, OAuth)
3. **Autoryzacja** - Kontroluj dostęp do operacji (role użytkowników)
4. **Rate limiting** - Ogranicz liczbę żądań API
5. **Input validation** - Walidacja jest już zaimplementowana, ale rozważ dodatkowe zabezpieczenia
6. **Monitoring** - Dodaj logi i monitoring aplikacji

## Różnice w porównaniu do programu 5250

| Funkcja | 5250 INSTMGR | Aplikacja Web |
|---------|--------------|---------------|
| Dodawanie | F6 | Przycisk "Dodaj instrument" |
| Edycja | Brak | Ikona ołówka w tabeli |
| Usuwanie | Opcja 4 | Ikona kosza w tabeli |
| Wyświetlanie | Subfile (10 rekordów) | Tabela (wszystkie rekordy) |
| Walidacja | Po zapisie | Real-time + po zapisie |
| Dostęp | Terminal 5250 | Przeglądarka WWW |

## Rozwiązywanie problemów

### Backend nie może połączyć się z bazą danych

- Sprawdź konfigurację DSN w pliku `.env`
- Zweryfikuj, że ODBC driver jest poprawnie zainstalowany
- Sprawdź uprawnienia użytkownika do tabeli INSTPF
- Sprawdź logi: `tail -f ~/.odbc.log` (jeśli włączone)

### Frontend nie może połączyć się z backendem

- Sprawdź czy backend działa: `curl http://localhost:3001/api/instruments`
- Sprawdź konfigurację CORS w backendzie
- Sprawdź URL API w pliku `.env` frontendu

### Błędy CORS

- Upewnij się, że adres frontendu jest w zmiennej `ALLOWED_ORIGINS` w backendzie
- W środowisku developerskim użyj proxy w Vite (już skonfigurowane)

## Wsparcie

W razie problemów sprawdź:
- Logi backendu: `console.log` w terminalu
- Konsola przeglądarki (F12) dla błędów frontendu
- Status połączenia z bazą danych

## Licencja

Do określenia przez właściciela projektu.
