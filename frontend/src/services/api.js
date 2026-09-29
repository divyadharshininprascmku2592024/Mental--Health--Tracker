import axios from 'axios';

// Default URLs for Django and Node backends
const DJANGO_URL =
  import.meta.env.VITE_DJANGO_API_URL ||
  import.meta.env.REACT_APP_DJANGO_API_URL ||
  'http://localhost:8000/api';

const NODE_URL =
  import.meta.env.VITE_NODE_API_URL ||
  import.meta.env.REACT_APP_NODE_API_URL ||
  'http://localhost:5000/api';

// Current active backend choice: 'django' or 'node' (persisted in localStorage)
let activeBackend = localStorage.getItem('active_backend') || 'django';

const getBaseUrl = () => {
  return activeBackend === 'node' ? NODE_URL : DJANGO_URL;
};

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  config.baseURL = getBaseUrl();
  return config;
});

export const getActiveBackend = () => activeBackend;

export const setActiveBackend = (backend) => {
  activeBackend = backend;
  localStorage.setItem('active_backend', backend);
  window.dispatchEvent(new Event('backend_changed'));
};

// --- MOOD SERVICES ---
export const fetchMoods = async () => (await api.get('/moods/')).data;
export const fetchMoodById = async (id) => (await api.get(`/moods/${id}/`)).data;
export const createMood = async (data) => (await api.post('/moods/', data)).data;
export const updateMood = async (id, data) => (await api.put(`/moods/${id}/`, data)).data;
export const deleteMood = async (id) => (await api.delete(`/moods/${id}/`)).data;

// --- JOURNAL SERVICES ---
export const fetchJournals = async () => (await api.get('/journals/')).data;
export const fetchJournalById = async (id) => (await api.get(`/journals/${id}/`)).data;
export const createJournal = async (data) => (await api.post('/journals/', data)).data;
export const updateJournal = async (id, data) => (await api.put(`/journals/${id}/`, data)).data;
export const deleteJournal = async (id) => (await api.delete(`/journals/${id}/`)).data;

// --- SLEEP SERVICES ---
export const fetchSleepRecords = async () => (await api.get('/sleep/')).data;
export const fetchSleepById = async (id) => (await api.get(`/sleep/${id}/`)).data;
export const createSleepRecord = async (data) => (await api.post('/sleep/', data)).data;
export const updateSleepRecord = async (id, data) => (await api.put(`/sleep/${id}/`, data)).data;
export const deleteSleepRecord = async (id) => (await api.delete(`/sleep/${id}/`)).data;

// --- ACTIVITY SERVICES ---
export const fetchActivities = async () => (await api.get('/activities/')).data;
export const fetchActivityById = async (id) => (await api.get(`/activities/${id}/`)).data;
export const createActivity = async (data) => (await api.post('/activities/', data)).data;
export const updateActivity = async (id, data) => (await api.put(`/activities/${id}/`, data)).data;
export const deleteActivity = async (id) => (await api.delete(`/activities/${id}/`)).data;

export default api;
