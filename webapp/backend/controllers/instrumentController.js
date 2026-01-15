const db = require('../db');

// GET wszystkie instrumenty
async function getAllInstruments(req, res) {
  try {
    const sql = `
      SELECT
        ISIN,
        SHORTNM,
        EMITENT,
        ISSUEDT,
        COUNTRY,
        CURRENCY,
        ISSUESZ
      FROM INSTPF
      ORDER BY ISIN
    `;

    const result = await db.query(sql);

    // Formatowanie daty dla frontendu
    const instruments = result.map(row => ({
      isin: row.ISIN.trim(),
      shortName: row.SHORTNM.trim(),
      emitent: row.EMITENT.trim(),
      issueDate: row.ISSUEDT,
      country: row.COUNTRY.trim(),
      currency: row.CURRENCY.trim(),
      issueSize: parseFloat(row.ISSUESZ)
    }));

    res.json(instruments);
  } catch (error) {
    console.error('Error fetching instruments:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania listy instrumentów' });
  }
}

// GET instrument po ISIN
async function getInstrumentByIsin(req, res) {
  try {
    const { isin } = req.params;

    const sql = `
      SELECT
        ISIN,
        SHORTNM,
        EMITENT,
        ISSUEDT,
        COUNTRY,
        CURRENCY,
        ISSUESZ
      FROM INSTPF
      WHERE ISIN = ?
    `;

    const result = await db.query(sql, [isin.toUpperCase()]);

    if (result.length === 0) {
      return res.status(404).json({ error: 'Instrument nie znaleziony' });
    }

    const row = result[0];
    const instrument = {
      isin: row.ISIN.trim(),
      shortName: row.SHORTNM.trim(),
      emitent: row.EMITENT.trim(),
      issueDate: row.ISSUEDT,
      country: row.COUNTRY.trim(),
      currency: row.CURRENCY.trim(),
      issueSize: parseFloat(row.ISSUESZ)
    };

    res.json(instrument);
  } catch (error) {
    console.error('Error fetching instrument:', error);
    res.status(500).json({ error: 'Błąd podczas pobierania instrumentu' });
  }
}

// POST nowy instrument
async function createInstrument(req, res) {
  try {
    const { isin, shortName, emitent, issueDate, country, currency, issueSize } = req.body;

    // Walidacja
    const validation = validateInstrument(req.body);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Sprawdź czy ISIN już istnieje
    const checkSql = 'SELECT ISIN FROM INSTPF WHERE ISIN = ?';
    const existing = await db.query(checkSql, [isin.toUpperCase()]);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Kod ISIN już istnieje w słowniku' });
    }

    // Wstaw nowy rekord
    const insertSql = `
      INSERT INTO INSTPF (
        ISIN, SHORTNM, EMITENT, ISSUEDT, COUNTRY, CURRENCY, ISSUESZ
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    await db.query(insertSql, [
      isin.toUpperCase(),
      shortName,
      emitent,
      issueDate,
      country.toUpperCase(),
      currency.toUpperCase(),
      issueSize
    ]);

    res.status(201).json({
      message: 'Instrument został dodany',
      isin: isin.toUpperCase()
    });
  } catch (error) {
    console.error('Error creating instrument:', error);
    res.status(500).json({ error: 'Błąd podczas dodawania instrumentu' });
  }
}

// PUT aktualizacja instrumentu
async function updateInstrument(req, res) {
  try {
    const { isin } = req.params;
    const { shortName, emitent, issueDate, country, currency, issueSize } = req.body;

    // Walidacja (bez ISIN, bo nie można go zmienić)
    const validation = validateInstrument({ ...req.body, isin }, true);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Sprawdź czy instrument istnieje
    const checkSql = 'SELECT ISIN FROM INSTPF WHERE ISIN = ?';
    const existing = await db.query(checkSql, [isin.toUpperCase()]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Instrument nie znaleziony' });
    }

    // Aktualizuj rekord
    const updateSql = `
      UPDATE INSTPF
      SET
        SHORTNM = ?,
        EMITENT = ?,
        ISSUEDT = ?,
        COUNTRY = ?,
        CURRENCY = ?,
        ISSUESZ = ?
      WHERE ISIN = ?
    `;

    await db.query(updateSql, [
      shortName,
      emitent,
      issueDate,
      country.toUpperCase(),
      currency.toUpperCase(),
      issueSize,
      isin.toUpperCase()
    ]);

    res.json({ message: 'Instrument został zaktualizowany' });
  } catch (error) {
    console.error('Error updating instrument:', error);
    res.status(500).json({ error: 'Błąd podczas aktualizacji instrumentu' });
  }
}

// DELETE usunięcie instrumentu
async function deleteInstrument(req, res) {
  try {
    const { isin } = req.params;

    // Sprawdź czy instrument istnieje
    const checkSql = 'SELECT ISIN FROM INSTPF WHERE ISIN = ?';
    const existing = await db.query(checkSql, [isin.toUpperCase()]);

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Instrument nie znaleziony' });
    }

    // Usuń rekord
    const deleteSql = 'DELETE FROM INSTPF WHERE ISIN = ?';
    await db.query(deleteSql, [isin.toUpperCase()]);

    res.json({ message: 'Instrument został usunięty' });
  } catch (error) {
    console.error('Error deleting instrument:', error);
    res.status(500).json({ error: 'Błąd podczas usuwania instrumentu' });
  }
}

// Funkcja walidacji
function validateInstrument(data, isUpdate = false) {
  const { isin, shortName, emitent, issueDate, country, currency, issueSize } = data;

  if (!isUpdate && (!isin || isin.trim() === '')) {
    return { valid: false, error: 'Kod ISIN jest wymagany' };
  }

  if (!shortName || shortName.trim() === '') {
    return { valid: false, error: 'Nazwa krótka jest wymagana' };
  }

  if (!emitent || emitent.trim() === '') {
    return { valid: false, error: 'Nazwa emitenta jest wymagana' };
  }

  if (!issueDate) {
    return { valid: false, error: 'Data emisji jest wymagana' };
  }

  if (!country || country.trim() === '') {
    return { valid: false, error: 'Kraj emisji jest wymagany' };
  }

  if (!currency || currency.trim() === '') {
    return { valid: false, error: 'Waluta emisji jest wymagana' };
  }

  if (!issueSize || issueSize <= 0) {
    return { valid: false, error: 'Wielkość emisji musi być większa od zera' };
  }

  return { valid: true };
}

module.exports = {
  getAllInstruments,
  getInstrumentByIsin,
  createInstrument,
  updateInstrument,
  deleteInstrument
};
