import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Box,
  CircularProgress,
  Typography,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

export default function InstrumentList({ instruments, loading, onAdd, onEdit, onDelete, onRefresh }) {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch {
      return dateString;
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('pl-PL', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(number);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={3}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="h2">
          Lista Instrumentów
        </Typography>
        <Box>
          <Tooltip title="Odśwież listę">
            <IconButton onClick={onRefresh} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAdd}
            sx={{ ml: 1 }}
          >
            Dodaj instrument
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.main' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kod ISIN</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nazwa</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Emitent</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Data emisji</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Kraj</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Waluta</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">
                Wielkość emisji
              </TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">
                Akcje
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instruments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                    Brak instrumentów w słowniku. Kliknij "Dodaj instrument" aby dodać pierwszy.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              instruments.map((instrument) => (
                <TableRow
                  key={instrument.isin}
                  hover
                  sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}
                >
                  <TableCell sx={{ fontFamily: 'monospace' }}>{instrument.isin}</TableCell>
                  <TableCell>{instrument.shortName}</TableCell>
                  <TableCell>{instrument.emitent}</TableCell>
                  <TableCell>{formatDate(instrument.issueDate)}</TableCell>
                  <TableCell>{instrument.country}</TableCell>
                  <TableCell>{instrument.currency}</TableCell>
                  <TableCell align="right">{formatNumber(instrument.issueSize)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edytuj">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => onEdit(instrument)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Usuń">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => onDelete(instrument.isin)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
