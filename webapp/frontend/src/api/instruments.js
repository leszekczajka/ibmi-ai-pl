import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Obsługa błędów
api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.error || 'Wystąpił błąd podczas komunikacji z serwerem';
    return Promise.reject(new Error(message));
  }
);

export const instrumentsApi = {
  // Pobierz wszystkie instrumenty
  getAll: async () => {
    const response = await api.get('/instruments');
    return response.data;
  },

  // Pobierz instrument po ISIN
  getByIsin: async (isin) => {
    const response = await api.get(`/instruments/${isin}`);
    return response.data;
  },

  // Dodaj nowy instrument
  create: async (instrument) => {
    const response = await api.post('/instruments', instrument);
    return response.data;
  },

  // Zaktualizuj instrument
  update: async (isin, instrument) => {
    const response = await api.put(`/instruments/${isin}`, instrument);
    return response.data;
  },

  // Usuń instrument
  delete: async (isin) => {
    const response = await api.delete(`/instruments/${isin}`);
    return response.data;
  }
};

export default instrumentsApi;
