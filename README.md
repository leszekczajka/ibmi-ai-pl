# IBMi-AI

Aplikacja do prowadzenia słownika instrumentów finansowych

Słownik instrumentów ma następujące atrybuty:
* kod ISIN - unikalnie identyfikuje instrument
* nazwa krótka instrumentu
* nazwa emitenta
* data emisji
* kraj emisji
* waluta emisji
* wielkość emisji

Słownik instrumentów przechowywany jest w bazie danych. Do przeglądania dostępny jest program działający w terminalu 5250, który prezentuje w formie subfile listę instrumentów. Lista jest posortowana po kodzie ISIN. Uzytkownik może przeglądać listę przewijając ją w dół i w górę przy użyciu PgUp i PgDn.

## Opcje

W programie dostępne są akcje:
* F3=Exit - Wyjście z programu
* F6=Add - Utworzenie nowego instrumentu w słowniku

Dla każdej wskazanej pozycji na liście dostępne są opcje:
* 4=Delete - usunięcie instrumentu ze słownika

Informacja o liście dostępnych akcji prezentowana jest w wierszu pod listą instrumentów. Informacja o liście dostępnych opcji prezentowana jest w wierszu nad listą instrumentów.

## Infrastruktura

* Serwer: IBM Power
* System: IBM i 7.5
* Baza danych: IBM DB2 for IBM i
* Język programowania: ILE RPG Free Form

## Szybki start

```bash
# W PASE na IBM i
cd /home/twoj_uzytkownik
git clone <url_repozytorium> ibmi-ai
cd ibmi-ai
make all

# Uruchomienie programu
system "CALL PGM(IBMIAI/INSTMGR)"
```

Więcej informacji w [KOMPILACJA.md](KOMPILACJA.md)

## Struktura projektu

### Kompilacja
- [Makefile](Makefile) - Automatyczna kompilacja projektu (użyj `make all`)

### Pliki bazy danych
- [INSTPF.PF](QDDSSRC/INSTPF.PF) - Plik fizyczny przechowujący dane instrumentów
- [INSTLF.LF](QDDSSRC/INSTLF.LF) - Plik logiczny z sortowaniem po ISIN

### Pliki display (ekrany)
- [INSTDSPF.DSPF](QDDSSRC/INSTDSPF.DSPF) - Ekran główny z listą instrumentów (subfile)
- [INSTMNT.DSPF](QDDSSRC/INSTMNT.DSPF) - Ekran dodawania/edycji instrumentu

### Programy
- [INSTMGR.RPGLE](QRPGLESRC/INSTMGR.RPGLE) - Główny program zarządzający w RPG ILE

### Dokumentacja
- [KOMPILACJA.md](KOMPILACJA.md) - Szczegółowa instrukcja kompilacji i uruchomienia aplikacji
