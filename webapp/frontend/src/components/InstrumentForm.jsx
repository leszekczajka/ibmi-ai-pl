import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box
} from '@mui/material';

const emptyInstrument = {
  isin: '',
  shortName: '',
  emitent: '',
  issueDate: '',
  country: '',
  currency: '',
  issueSize: ''
};

export default function InstrumentForm({ open, instrument, onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyInstrument);
  const [errors, setErrors] = useState({});

  const isEditMode = !!instrument;

  useEffect(() => {
    if (open) {
      if (instrument) {
        // Tryb edycji - załaduj dane instrumentu
        setFormData({
          isin: instrument.isin || '',
          shortName: instrument.shortName || '',
          emitent: instrument.emitent || '',
          issueDate: instrument.issueDate?.split('T')[0] || '',
          country: instrument.country || '',
          currency: instrument.currency || '',
          issueSize: instrument.issueSize?.toString() || ''
        });
      } else {
        // Tryb dodawania - wyczyść formularz
        setFormData(emptyInstrument);
      }
      setErrors({});
    }
  }, [open, instrument]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));

    // Wyczyść błąd dla tego pola
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.isin.trim()) {
      newErrors.isin = 'Kod ISIN jest wymagany';
    } else if (formData.isin.length > 12) {
      newErrors.isin = 'Kod ISIN może mieć maksymalnie 12 znaków';
    }

    if (!formData.shortName.trim()) {
      newErrors.shortName = 'Nazwa krótka jest wymagana';
    } else if (formData.shortName.length > 40) {
      newErrors.shortName = 'Nazwa krótka może mieć maksymalnie 40 znaków';
    }

    if (!formData.emitent.trim()) {
      newErrors.emitent = 'Nazwa emitenta jest wymagana';
    } else if (formData.emitent.length > 60) {
      newErrors.emitent = 'Nazwa emitenta może mieć maksymalnie 60 znaków';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Data emisji jest wymagana';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Kraj emisji jest wymagany';
    } else if (formData.country.length !== 2) {
      newErrors.country = 'Kod kraju musi mieć 2 znaki (ISO)';
    }

    if (!formData.currency.trim()) {
      newErrors.currency = 'Waluta emisji jest wymagana';
    } else if (formData.currency.length !== 3) {
      newErrors.currency = 'Kod waluty musi mieć 3 znaki (ISO)';
    }

    if (!formData.issueSize || formData.issueSize === '') {
      newErrors.issueSize = 'Wielkość emisji jest wymagana';
    } else if (isNaN(formData.issueSize) || parseFloat(formData.issueSize) <= 0) {
      newErrors.issueSize = 'Wielkość emisji musi być większa od zera';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    const dataToSave = {
      ...formData,
      isin: formData.isin.toUpperCase(),
      country: formData.country.toUpperCase(),
      currency: formData.currency.toUpperCase(),
      issueSize: parseFloat(formData.issueSize)
    };

    onSave(dataToSave);
  };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditMode ? 'Edycja instrumentu' : 'Dodawanie instrumentu'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Kod ISIN"
                value={formData.isin}
                onChange={handleChange('isin')}
                error={!!errors.isin}
                helperText={errors.isin}
                disabled={isEditMode}
                inputProps={{ maxLength: 12, style: { textTransform: 'uppercase' } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Data emisji"
                type="date"
                value={formData.issueDate}
                onChange={handleChange('issueDate')}
                error={!!errors.issueDate}
                helperText={errors.issueDate}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nazwa krótka"
                value={formData.shortName}
                onChange={handleChange('shortName')}
                error={!!errors.shortName}
                helperText={errors.shortName}
                inputProps={{ maxLength: 40 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Emitent"
                value={formData.emitent}
                onChange={handleChange('emitent')}
                error={!!errors.emitent}
                helperText={errors.emitent}
                inputProps={{ maxLength: 60 }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Kraj emisji (ISO)"
                value={formData.country}
                onChange={handleChange('country')}
                error={!!errors.country}
                helperText={errors.country || 'Np. PL, US, DE'}
                inputProps={{ maxLength: 2, style: { textTransform: 'uppercase' } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Waluta emisji (ISO)"
                value={formData.currency}
                onChange={handleChange('currency')}
                error={!!errors.currency}
                helperText={errors.currency || 'Np. PLN, USD, EUR'}
                inputProps={{ maxLength: 3, style: { textTransform: 'uppercase' } }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Wielkość emisji"
                type="number"
                value={formData.issueSize}
                onChange={handleChange('issueSize')}
                error={!!errors.issueSize}
                helperText={errors.issueSize}
                inputProps={{ step: '0.01', min: '0' }}
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>
          Anuluj
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEditMode ? 'Zapisz zmiany' : 'Dodaj'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
