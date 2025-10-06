const API_BASE_URL = 'https://test.clubafricain.site/api';
//const API_BASE_URL = 'http://localhost:8081/api';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  GET_MATCHES: `${API_BASE_URL}/games`,
  SCAN_QR: `${API_BASE_URL}/stadium-access/scan`,
  GET_MATCH_STATS: `${API_BASE_URL}/stats/matches`
};

export const API_CONFIG = {
  BASE_URL: API_BASE_URL,
  TIMEOUT: 10000,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};
