import { useState, useEffect } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Alert,
  Snackbar
} from '@mui/material';
import InstrumentList from './components/InstrumentList';
import InstrumentForm from './components/InstrumentForm';
import { instrumentsApi } from './api/instruments';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingInstrument, setEditingInstrument] = useState(null);

  // Pobierz listę instrumentów
  const loadInstruments = async () => {
    try {
      setLoading(true);
      const data = await instrumentsApi.getAll();
      setInstruments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstruments();
  }, []);

  // Obsługa dodawania nowego instrumentu
  const handleAdd = () => {
    setEditingInstrument(null);
    setFormOpen(true);
  };

  // Obsługa edycji instrumentu
  const handleEdit = (instrument) => {
    setEditingInstrument(instrument);
    setFormOpen(true);
  };

  // Obsługa usuwania instrumentu
  const handleDelete = async (isin) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten instrument?')) {
      return;
    }

    try {
      await instrumentsApi.delete(isin);
      setSuccess('Instrument został usunięty');
      loadInstruments();
    } catch (err) {
      setError(err.message);
    }
  };

  // Obsługa zapisu formularza
  const handleSave = async (instrument) => {
    try {
      if (editingInstrument) {
        // Edycja
        await instrumentsApi.update(editingInstrument.isin, instrument);
        setSuccess('Instrument został zaktualizowany');
      } else {
        // Dodawanie
        await instrumentsApi.create(instrument);
        setSuccess('Instrument został dodany');
      }
      setFormOpen(false);
      loadInstruments();
    } catch (err) {
      setError(err.message);
    }
  };

  // Obsługa anulowania formularza
  const handleCancel = () => {
    setFormOpen(false);
    setEditingInstrument(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Słownik Instrumentów Finansowych
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <InstrumentList
            instruments={instruments}
            loading={loading}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRefresh={loadInstruments}
          />

          <InstrumentForm
            open={formOpen}
            instrument={editingInstrument}
            onSave={handleSave}
            onCancel={handleCancel}
          />

          {/* Komunikaty o błędach */}
          <Snackbar
            open={!!error}
            autoHideDuration={6000}
            onClose={() => setError(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>

          {/* Komunikaty o sukcesie */}
          <Snackbar
            open={!!success}
            autoHideDuration={3000}
            onClose={() => setSuccess(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert onClose={() => setSuccess(null)} severity="success" sx={{ width: '100%' }}>
              {success}
            </Alert>
          </Snackbar>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
