# ================================================================
# Makefile dla projektu IBMi-AI
# ================================================================
# Użycie:
#   make all      - Kompilacja wszystkich obiektów
#   make clean    - Usunięcie biblioteki i wszystkich obiektów
#   make setup    - Utworzenie biblioteki i plików źródłowych
#   make files    - Kompilacja plików bazy danych
#   make displays - Kompilacja display files
#   make programs - Kompilacja programów RPG
# ================================================================

# Konfiguracja
LIB = IBMIAI
SRCPF_DDS = QDDSSRC
SRCPF_RPG = QRPGLESRC

# Obiekty do skompilowania
PF_FILES = INSTPF
LF_FILES = INSTLF
DSPF_FILES = INSTDSPF INSTMNT
RPG_PROGRAMS = INSTMGR

# System IFS path (zakładamy, że Makefile jest w głównym katalogu projektu)
BASEDIR = $(shell pwd)

# ================================================================
# Target główny - kompilacja wszystkiego
# ================================================================
.PHONY: all
all: setup files displays programs
	@echo "==============================================="
	@echo "Kompilacja zakończona pomyślnie!"
	@echo "Uruchom program: CALL PGM($(LIB)/INSTMGR)"
	@echo "==============================================="

# ================================================================
# Setup - tworzenie biblioteki i plików źródłowych
# ================================================================
.PHONY: setup
setup:
	@echo "Tworzenie biblioteki $(LIB)..."
	-system "CRTLIB LIB($(LIB)) TEXT('Słownik instrumentów finansowych')" 2>/dev/null || true
	@echo "Tworzenie plików źródłowych..."
	-system "CRTSRCPF FILE($(LIB)/$(SRCPF_DDS)) RCDLEN(112) TEXT('DDS Source File')" 2>/dev/null || true
	-system "CRTSRCPF FILE($(LIB)/$(SRCPF_RPG)) RCDLEN(112) TEXT('RPG Source File')" 2>/dev/null || true
	@echo "Kopiowanie źródeł DDS..."
	@for file in $(PF_FILES) $(LF_FILES) $(DSPF_FILES); do \
		echo "  Kopiowanie $$file..."; \
		ext=$$(find $(BASEDIR)/QDDSSRC -name "$$file.*" | sed 's/.*\.//'); \
		system "CPYFRMSTMF FROMSTMF('$(BASEDIR)/QDDSSRC/$$file.$$ext') TOMBR('/QSYS.LIB/$(LIB).LIB/$(SRCPF_DDS).FILE/$$file.MBR') MBROPT(*REPLACE)" 2>/dev/null || true; \
	done
	@echo "Kopiowanie źródeł RPG..."
	@for file in $(RPG_PROGRAMS); do \
		echo "  Kopiowanie $$file..."; \
		system "CPYFRMSTMF FROMSTMF('$(BASEDIR)/QRPGLESRC/$$file.RPGLE') TOMBR('/QSYS.LIB/$(LIB).LIB/$(SRCPF_RPG).FILE/$$file.MBR') MBROPT(*REPLACE)" 2>/dev/null || true; \
	done
	@echo "Setup zakończony."

# ================================================================
# Kompilacja plików bazy danych
# ================================================================
.PHONY: files
files: pf lf

.PHONY: pf
pf:
	@echo "Kompilacja plików fizycznych..."
	@for file in $(PF_FILES); do \
		echo "  Kompilacja $$file..."; \
		system "CRTPF FILE($(LIB)/$$file) SRCFILE($(LIB)/$(SRCPF_DDS)) SRCMBR($$file)" || exit 1; \
	done

.PHONY: lf
lf:
	@echo "Kompilacja plików logicznych..."
	@for file in $(LF_FILES); do \
		echo "  Kompilacja $$file..."; \
		system "CRTLF FILE($(LIB)/$$file) SRCFILE($(LIB)/$(SRCPF_DDS)) SRCMBR($$file)" || exit 1; \
	done

# ================================================================
# Kompilacja display files
# ================================================================
.PHONY: displays
displays:
	@echo "Kompilacja display files..."
	@for file in $(DSPF_FILES); do \
		echo "  Kompilacja $$file..."; \
		system "CRTDSPF FILE($(LIB)/$$file) SRCFILE($(LIB)/$(SRCPF_DDS)) SRCMBR($$file)" || exit 1; \
	done

# ================================================================
# Kompilacja programów RPG
# ================================================================
.PHONY: programs
programs:
	@echo "Kompilacja programów RPG..."
	@for file in $(RPG_PROGRAMS); do \
		echo "  Kompilacja $$file..."; \
		system "CRTBNDRPG PGM($(LIB)/$$file) SRCFILE($(LIB)/$(SRCPF_RPG)) SRCMBR($$file) DBGVIEW(*SOURCE)" || exit 1; \
	done

# ================================================================
# Czyszczenie - usunięcie biblioteki
# ================================================================
.PHONY: clean
clean:
	@echo "Usuwanie biblioteki $(LIB)..."
	-system "DLTLIB LIB($(LIB))" 2>/dev/null || true
	@echo "Czyszczenie zakończone."

# ================================================================
# Rebuild - czyszczenie i ponowna kompilacja
# ================================================================
.PHONY: rebuild
rebuild: clean all

# ================================================================
# Help - wyświetlenie pomocy
# ================================================================
.PHONY: help
help:
	@echo "Dostępne komendy:"
	@echo "  make all       - Kompilacja wszystkich obiektów"
	@echo "  make setup     - Utworzenie biblioteki i skopiowanie źródeł"
	@echo "  make files     - Kompilacja plików bazy danych (PF i LF)"
	@echo "  make displays  - Kompilacja display files"
	@echo "  make programs  - Kompilacja programów RPG"
	@echo "  make clean     - Usunięcie biblioteki i wszystkich obiektów"
	@echo "  make rebuild   - Czyszczenie i ponowna kompilacja"
	@echo "  make help      - Wyświetlenie tej pomocy"
	@echo ""
	@echo "Konfiguracja:"
	@echo "  Biblioteka: $(LIB)"
	@echo "  Katalog bazowy: $(BASEDIR)"
