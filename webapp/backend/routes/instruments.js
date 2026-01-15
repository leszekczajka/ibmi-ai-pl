const express = require('express');
const router = express.Router();
const instrumentController = require('../controllers/instrumentController');

// GET wszystkie instrumenty
router.get('/', instrumentController.getAllInstruments);

// GET instrument po ISIN
router.get('/:isin', instrumentController.getInstrumentByIsin);

// POST nowy instrument
router.post('/', instrumentController.createInstrument);

// PUT aktualizacja instrumentu
router.put('/:isin', instrumentController.updateInstrument);

// DELETE usunięcie instrumentu
router.delete('/:isin', instrumentController.deleteInstrument);

module.exports = router;
