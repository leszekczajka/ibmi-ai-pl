     H DFTACTGRP(*NO) ACTGRP(*CALLER)
     H OPTION(*NODEBUGIO:*SRCSTMT)

      *================================================================
      * Program INSTMGR - Zarządzanie słownikiem instrumentów
      *================================================================

     FINSTLF    IF   E           K DISK
     FINSTPF    UF A E           K DISK    RENAME(INSTREC:INSTPFR)
     FINSTDSPF  CF   E             WORKSTN
     F                                     SFILE(SFL:RRN)
     FINSTMNT   CF   E             WORKSTN

     D RRN             S              4P 0
     D LASTKEY         S             12A
     D ACTION          S              1A
     D EOF             S               N

      * Procedura główna
      /FREE
         Dow '1';
            LoadSubfile();
            DisplayList();

            Select;
               When *IN03;  // F3=Exit
                  Leave;
               When *IN06;  // F6=Add
                  AddInstrument();
               Other;
                  ProcessOptions();
            Endsl;
         Enddo;

         *INLR = *ON;
         Return;
      /END-FREE

      *================================================================
      * Procedura LoadSubfile - Ładowanie subfile
      *================================================================
     P LoadSubfile     B
     D LoadSubfile     PI

      /FREE
         *IN33 = *ON;  // SFLCLR
         WRITE SFLCTL;
         *IN33 = *OFF;

         RRN = 0;
         SETLL *LOVAL INSTREC;
         EOF = *OFF;

         Dow NOT EOF;
            READ INSTREC;
            If %EOF(INSTLF);
               EOF = *ON;
            Else;
               RRN = RRN + 1;
               SFOPT = '';
               SFISIN = ISIN;
               SFSHORT = SHORTNM;
               SFEMIT = EMITENT;
               SFISSDT = %CHAR(ISSUEDT:*ISO);
               SFCNTRY = COUNTRY;
               SFCURR = CURRENCY;
               WRITE SFL;
            Endif;
         Enddo;

         If RRN = 0;
            *IN34 = *ON;  // SFLEND
         Endif;
      /END-FREE
     P LoadSubfile     E

      *================================================================
      * Procedura DisplayList - Wyświetlenie listy
      *================================================================
     P DisplayList     B
     D DisplayList     PI

      /FREE
         *IN31 = (RRN > 0);  // SFLDSP
         *IN32 = *ON;        // SFLDSPCTL

         WRITE HEADER;
         WRITE FOOTER;
         EXFMT SFLCTL;

         *IN31 = *OFF;
         *IN32 = *OFF;
      /END-FREE
     P DisplayList     E

      *================================================================
      * Procedura ProcessOptions - Przetwarzanie opcji
      *================================================================
     P ProcessOptions  B
     D ProcessOptions  PI
     D I               S              4P 0

      /FREE
         For I = 1 to RRN;
            CHAIN I SFL;
            If SFOPT <> '';
               Select;
                  When SFOPT = '4';  // Delete
                     DelInstr(SFISIN);
                  Other;
                     // Nieznana opcja - ignoruj
               Endsl;
               SFOPT = '';
               UPDATE SFL;
            Endif;
         Endfor;
      /END-FREE
     P ProcessOptions  E

      *================================================================
      * Procedura AddInstrument - Dodawanie instrumentu
      *================================================================
     P AddInstrument   B
     D AddInstrument   PI
     D VALIDOK         S               N

      /FREE
         MODE = 'DODAWANIE';
         ISIN = '';
         SHORTNM = '';
         EMITENT = '';
         ISSUEDT = D'0001-01-01';
         COUNTRY = '';
         CURRENCY = '';
         ISSUESZ = 0;
         ERRMSG = '';

         Dow '1';
            EXFMT MNTSCR;

            If *IN03 or *IN12;  // F3 lub F12=Anuluj
               Leave;
            Endif;

            // Walidacja
            VALIDOK = ValidInstr();

            If VALIDOK;
               WRITE INSTPFR;
               Leave;
            Endif;
         Enddo;
      /END-FREE
     P AddInstrument   E

      *================================================================
      * Procedura DelInstr - Usuwanie instrumentu
      *================================================================
     P DelInstr        B
     D DelInstr        PI
     D   PISIN                       12A   CONST

      /FREE
         CHAIN PISIN INSTPFR;
         If %FOUND(INSTPF);
            DELETE INSTPFR;
         Endif;
      /END-FREE
     P DelInstr        E

      *================================================================
      * Procedura ValidInstr - Walidacja danych instrumentu
      *================================================================
     P ValidInstr      B
     D ValidInstr      PI             1N

      /FREE
         *IN50 = *OFF;
         *IN51 = *OFF;
         *IN52 = *OFF;
         *IN53 = *OFF;
         *IN54 = *OFF;
         *IN55 = *OFF;
         *IN56 = *OFF;
         ERRMSG = '';

         // Walidacja ISIN
         If ISIN = '';
            *IN50 = *ON;
            ERRMSG = 'Kod ISIN jest wymagany';
            Return *OFF;
         Endif;

         // Sprawdź czy ISIN już istnieje
         CHAIN ISIN INSTPFR;
         If %FOUND(INSTPF);
            *IN50 = *ON;
            ERRMSG = 'Kod ISIN już istnieje w słowniku';
            Return *OFF;
         Endif;

         // Walidacja nazwy krótkiej
         If SHORTNM = '';
            *IN51 = *ON;
            ERRMSG = 'Nazwa krótka jest wymagana';
            Return *OFF;
         Endif;

         // Walidacja emitenta
         If EMITENT = '';
            *IN52 = *ON;
            ERRMSG = 'Nazwa emitenta jest wymagana';
            Return *OFF;
         Endif;

         // Walidacja daty emisji
         If ISSUEDT = D'0001-01-01';
            *IN53 = *ON;
            ERRMSG = 'Data emisji jest wymagana';
            Return *OFF;
         Endif;

         // Walidacja kraju
         If COUNTRY = '';
            *IN54 = *ON;
            ERRMSG = 'Kraj emisji jest wymagany';
            Return *OFF;
         Endif;

         // Walidacja waluty
         If CURRENCY = '';
            *IN55 = *ON;
            ERRMSG = 'Waluta emisji jest wymagana';
            Return *OFF;
         Endif;

         // Walidacja wielkości emisji
         If ISSUESZ <= 0;
            *IN56 = *ON;
            ERRMSG = 'Wielkość emisji musi być większa od zera';
            Return *OFF;
         Endif;

         Return *ON;
      /END-FREE
     P ValidInstr      E
