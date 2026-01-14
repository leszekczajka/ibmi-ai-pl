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

W programie dostępne są opcje:
* F3=Exit - Wyjście z programu
* F6=Add - Utworzenie nowego instrumentu w słowniku

Dla każdej wskazanej pozycji na liście dostępne są opcje:
* 4=Delete - usunięcie instrumentu ze słownika


## Infrastruktura

* Serwer: IBM Power
* System: IBM i 7.5
* Baza danych: IBM DB2 for IBM i

## Struktura projektu

### Pliki bazy danych
- [INSTPF.PF](QDDSSRC/INSTPF.PF) - Plik fizyczny przechowujący dane instrumentów
- [INSTLF.LF](QDDSSRC/INSTLF.LF) - Plik logiczny z sortowaniem po ISIN

### Pliki display (ekrany)
- [INSTDSPF.DSPF](QDDSSRC/INSTDSPF.DSPF) - Ekran główny z listą instrumentów (subfile)
- [INSTMNT.DSPF](QDDSSRC/INSTMNT.DSPF) - Ekran dodawania/edycji instrumentu

### Programy
- [INSTMGR.RPGLE](QRPGLESRC/INSTMGR.RPGLE) - Główny program zarządzający w RPG ILE

### Dokumentacja
- [KOMPILACJA.md](KOMPILACJA.md) - Instrukcja kompilacji i uruchomienia aplikacji
