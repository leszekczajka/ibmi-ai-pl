# Instrukcja kompilacji i uruchomienia aplikacji IBMi-AI

## Wymagania

- IBM i 7.5 lub nowszy
- Dostęp do biblioteki (np. IBMIAI)
- Uprawnienia do tworzenia obiektów

## Struktura katalogów

```
ibmi-ai/
├── QDDSSRC/          - Źródła DDS (pliki fizyczne, logiczne, display)
│   ├── INSTPF.PF     - Plik fizyczny instrumentów
│   ├── INSTLF.LF     - Plik logiczny (sortowanie po ISIN)
│   ├── INSTDSPF.DSPF - Display file dla listy
│   └── INSTMNT.DSPF  - Display file dla dodawania/edycji
└── QRPGLESRC/        - Źródła RPG
    └── INSTMGR.RPGLE - Program zarządzający
```

## Krok 1: Utworzenie biblioteki

```
CRTLIB LIB(IBMIAI) TEXT('Słownik instrumentów finansowych')
```

## Krok 2: Utworzenie pliku źródłowego dla DDS

```
CRTSRCPF FILE(IBMIAI/QDDSSRC) RCDLEN(112) TEXT('DDS Source File')
```

## Krok 3: Utworzenie pliku źródłowego dla RPG

```
CRTSRCPF FILE(IBMIAI/QRPGLESRC) RCDLEN(112) TEXT('RPG Source File')
```

## Krok 4: Skopiowanie źródeł

Skopiuj pliki ze struktury katalogów do odpowiednich source physical files:

### Pliki DDS (QDDSSRC):
```
CPYFRMSTMF FROMSTMF('/home/leszek/Pulpit/ibmi-ai/QDDSSRC/INSTPF.PF') +
           TOMBR('/QSYS.LIB/IBMIAI.LIB/QDDSSRC.FILE/INSTPF.MBR') +
           MBROPT(*REPLACE)

CPYFRMSTMF FROMSTMF('/home/leszek/Pulpit/ibmi-ai/QDDSSRC/INSTLF.LF') +
           TOMBR('/QSYS.LIB/IBMIAI.LIB/QDDSSRC.FILE/INSTLF.MBR') +
           MBROPT(*REPLACE)

CPYFRMSTMF FROMSTMF('/home/leszek/Pulpit/ibmi-ai/QDDSSRC/INSTDSPF.DSPF') +
           TOMBR('/QSYS.LIB/IBMIAI.LIB/QDDSSRC.FILE/INSTDSPF.MBR') +
           MBROPT(*REPLACE)

CPYFRMSTMF FROMSTMF('/home/leszek/Pulpit/ibmi-ai/QDDSSRC/INSTMNT.DSPF') +
           TOMBR('/QSYS.LIB/IBMIAI.LIB/QDDSSRC.FILE/INSTMNT.MBR') +
           MBROPT(*REPLACE)
```

### Program RPG (QRPGLESRC):
```
CPYFRMSTMF FROMSTMF('/home/leszek/Pulpit/ibmi-ai/QRPGLESRC/INSTMGR.RPGLE') +
           TOMBR('/QSYS.LIB/IBMIAI.LIB/QRPGLESRC.FILE/INSTMGR.MBR') +
           MBROPT(*REPLACE)
```

## Krok 5: Kompilacja obiektów

### 5.1 Utworzenie pliku fizycznego
```
CRTPF FILE(IBMIAI/INSTPF) SRCFILE(IBMIAI/QDDSSRC) SRCMBR(INSTPF)
```

### 5.2 Utworzenie pliku logicznego
```
CRTLF FILE(IBMIAI/INSTLF) SRCFILE(IBMIAI/QDDSSRC) SRCMBR(INSTLF)
```

### 5.3 Utworzenie display files
```
CRTDSPF FILE(IBMIAI/INSTDSPF) SRCFILE(IBMIAI/QDDSSRC) SRCMBR(INSTDSPF)

CRTDSPF FILE(IBMIAI/INSTMNT) SRCFILE(IBMIAI/QDDSSRC) SRCMBR(INSTMNT)
```

### 5.4 Kompilacja programu RPG
```
CRTBNDRPG PGM(IBMIAI/INSTMGR) SRCFILE(IBMIAI/QRPGLESRC) SRCMBR(INSTMGR) +
          DBGVIEW(*SOURCE)
```

## Krok 6: Uruchomienie aplikacji

```
CALL PGM(IBMIAI/INSTMGR)
```

## Funkcje aplikacji

### Ekran główny - Lista instrumentów
- **F3** - Wyjście z programu
- **F6** - Dodanie nowego instrumentu
- **PgUp/PgDn** - Przewijanie listy
- **Opcja 4** - Usunięcie instrumentu (wpisz "4" obok wybranego instrumentu)

### Ekran dodawania instrumentu
- **F3/F12** - Anulowanie i powrót do listy
- Po wypełnieniu wszystkich pól naciśnij **Enter** aby zapisać

### Pola wymagane:
1. **Kod ISIN** - 12 znaków (unikalny identyfikator)
2. **Nazwa krótka** - do 40 znaków
3. **Emitent** - do 60 znaków
4. **Data emisji** - format DD/MM/RRRR
5. **Kraj emisji** - 2 znaki (kod ISO)
6. **Waluta emisji** - 3 znaki (kod ISO, np. PLN, USD, EUR)
7. **Wielkość emisji** - wartość liczbowa (do 15 cyfr, 2 miejsca po przecinku)

## Uwagi

- Wszystkie pola są wymagane podczas dodawania instrumentu
- Kod ISIN musi być unikalny
- Lista jest automatycznie sortowana po kodzie ISIN
- Wielkość emisji musi być większa od zera

## Rozwiązywanie problemów

### Błąd kompilacji display file
Jeśli wystąpi błąd podczas kompilacji DSPF, sprawdź:
```
DSPMSGD MSGID(CPFxxxx) MSGF(QCPFMSG)
```

### Sprawdzenie obiektów
```
WRKOBJ OBJ(IBMIAI/*ALL) OBJTYPE(*ALL)
```

### Wyświetlenie danych w pliku
```
RUNQRY QRY(*NONE) QRYFILE((IBMIAI/INSTPF))
```

## Dodatkowe komendy

### Czyszczenie danych
```
CLRPFM FILE(IBMIAI/INSTPF)
```

### Usunięcie wszystkich obiektów
```
DLTLIB LIB(IBMIAI)
```
