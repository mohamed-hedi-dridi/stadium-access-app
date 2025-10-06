import axios, { AxiosResponse } from 'axios';
import { API_CONFIG, API_ENDPOINTS } from '../constants/api';

// Configuration d'axios
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS
});

// Interface pour la réponse de login
export interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

// Interface pour la réponse des matchs
export interface Match {
  id: string;
  homeTeam?: string;
  awayTeam?: string;
  homeTeam_logo?: string;
  awayTeam_logo?: string;
  date?: string;
  time?: string;
  stadium?: string;
  status?: string;
  dateTimeScann?: string;
}

export interface MatchesResponse {
  success: boolean;
  message?: string;
  matches?: Match[];
}

// Interface pour la réponse du scan QR
export interface ScanQRResponse {
  success: boolean;
  message?: string;
  ticket?: {
    id: string;
    matchId: string;
    seatNumber: string;
    isValid: boolean;
  };
}

// Interface pour les statistiques par zone
export interface ZoneStats {
  zone: string;
  zone_raw: string;
  total_qrcodes: number;
  used_qrcodes: number;
  fraud_qrcodes: number;
  unused_qrcodes: number;
  usage_percentage: number;
  fraud_percentage: number;
  avg_usage_time_minutes: number;
}

// Interface pour les informations du match
export interface MatchInfo {
  id: number;
  home_team: string;
  away_team: string;
  match_name: string;
  game_date: string;
  game_date_formatted: string;
  season: string;
  match_day: number;
  total_qr_codes: number;
  used_qr_codes: number;
  fraud_qr_codes: number;
  unused_qr_codes: number;
  usage_percentage: number;
  fraud_percentage: number;
  usage_time_stats: {
    earliest_usage_minutes: number;
    latest_usage_minutes: number;
    avg_usage_time_minutes: number;
  };
}

// Interface pour le résumé des statistiques
export interface StatsSummary {
  total_zones: number;
  zones_with_data: number;
  zones_without_data: number;
  most_used_zone: ZoneStats;
  least_used_zone: ZoneStats;
  highest_fraud_zone: ZoneStats;
}

// Interface pour la réponse des statistiques de match
export interface MatchStatsResponse {
  success: boolean;
  message?: string;
  match?: MatchInfo;
  zones?: ZoneStats[];
  summary?: StatsSummary;
}

// Fonction pour faire des requêtes authentifiées
export const authenticatedApiRequest = async <T>(
  endpoint: string,
  token: string
): Promise<T> => {
  const headers = {
    ...API_CONFIG.HEADERS,
    'Authorization': `Bearer ${token}`
  };

  console.log('Headers envoyés:', headers);
  console.log('Endpoint appelé:', endpoint);
  
  const response: AxiosResponse<T> = await apiClient.get(endpoint, { headers });
  console.log('Réponse reçue:', response.data);
  return response.data;
};

// Service d'authentification
export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await apiClient.post(
        API_ENDPOINTS.LOGIN,
        { email, password }
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }
};

// Service des matchs
export const matchesService = {
  getMatches: async (token: string): Promise<MatchesResponse> => {
    try {
      return await authenticatedApiRequest<MatchesResponse>(
        API_ENDPOINTS.GET_MATCHES,
        token
      );
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
      throw error;
    }
  }
};

// Service de scan QR
export const scanService = {
  scanQR: async (qrCode: string, gameId: string, scannedBy: string, token: string): Promise<ScanQRResponse> => {
    try {
      const headers = {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${token}`
      };

      const requestData = {
        game_id: gameId,
        qr_code_data: qrCode,
        scanned_by: scannedBy
      };

      console.log('Données envoyées au scan QR:', requestData);
      console.log('Headers envoyés:', headers);

      const response: AxiosResponse<ScanQRResponse> = await apiClient.post(
        API_ENDPOINTS.SCAN_QR,
        requestData,
        { headers }
      );
      
      console.log('Réponse du scan QR:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du scan QR:', error);
      throw error;
    }
  }
};

// Service des statistiques de match
export const statsService = {
  getMatchStats: async (matchId: string, token: string): Promise<MatchStatsResponse> => {
    try {
      const endpoint = `${API_ENDPOINTS.GET_MATCH_STATS}/${matchId}`;
      console.log('Endpoint des statistiques:', endpoint);
      const result = await authenticatedApiRequest<MatchStatsResponse>(endpoint, token);
      console.log('Résultat brut des statistiques:', result);
      return result;
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // Retourner une réponse d'erreur structurée au lieu de throw
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue lors du chargement des statistiques'
      };
    }
  }
};
