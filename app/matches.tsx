import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  Image,
  ScrollView,
  Modal,
  Platform
} from 'react-native';
import { router } from 'expo-router';
import { matchesService, Match, statsService, MatchStatsResponse, ZoneStats, MatchInfo, StatsSummary } from '../services/api';
import { useAuth } from '@/contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'finished'>('upcoming');
  const [statsModalVisible, setStatsModalVisible] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
  const [matchStats, setMatchStats] = useState<MatchStatsResponse | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const { token, logout } = useAuth();

  // Séparer les matchs en deux catégories
  const upcomingMatches = matches.filter(match => 
    match.status?.toLowerCase() === 'upcoming' || match.status?.toLowerCase() === 'active'
  );
  
  const finishedMatches = matches.filter(match => 
    match.status?.toLowerCase() === 'finished'
  );

  const loadMatches = async () => {
    try {
      
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
        return;
      }

      console.log('Chargement des matchs avec le token:', token.substring(0, 20) + '...');
      console.log('URL de l\'API:', 'https://test.clubafricain.site/api/games');
      
      const response = await matchesService.getMatches(token);
      
      console.log('Réponse de l\'API matchs:', response);
      
      if (response.success === true) {
        console.log(response);
        
        setMatches(response.matches || []);
        setError(null);
        console.log('Matchs chargés avec succès:', response.matches?.length || 0, 'matchs');
      } else {
        setError(response.message || 'Erreur lors du chargement des matchs');
        console.error('Erreur API:', response.message);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
      
      // Données de test en cas d'erreur
      console.log('Chargement des données de test...');
      setError('Mode test - Données simulées'+error);
    }
  };

  useEffect(() => {
    loadMatches().finally(() => setLoading(false));
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  };

  const loadMatchStats = async (matchId: string) => {
    try {
      setLoadingStats(true);
      setMatchStats(null);
      
      if (!token) {
        Alert.alert('Erreur', 'Token d\'authentification manquant');
        return;
      }

      console.log('Chargement des statistiques pour le match:', matchId);
      const response = await statsService.getMatchStats(matchId, token);
      
      console.log('Réponse des statistiques complète:', JSON.stringify(response, null, 2));
      console.log('Type de response:', typeof response);
      console.log('response.success:', response.success);
      console.log('response.match:', response.match);
      console.log('response.zones:', response.zones);
      console.log('response.message:', response.message);
      
      setMatchStats(response);
      
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      setMatchStats({
        success: false,
        message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const handleViewStats = (match: Match) => {
    setSelectedMatch(match);
    setStatsModalVisible(true);
    loadMatchStats(match.id);
  };

  // Fonction utilitaire pour rendre le contenu des statistiques de manière sécurisée
  const renderStatsContent = () => {
    try {
      if (!matchStats) return null;
      
      if (!matchStats.success) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              ❌ {matchStats.message || 'Erreur lors du chargement des statistiques'}
            </Text>
          </View>
        );
      }

      if (!matchStats.match || !matchStats.zones) {
        return (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              🔍 Debug: matchStats existe mais match ou zones sont null/undefined
            </Text>
            <Text style={styles.debugText}>
              matchStats.success: {matchStats.success ? 'true' : 'false'}
            </Text>
            <Text style={styles.debugText}>
              matchStats.match: {matchStats.match ? 'exists' : 'null/undefined'}
            </Text>
            <Text style={styles.debugText}>
              matchStats.zones: {matchStats.zones ? `exists (${matchStats.zones.length} zones)` : 'null/undefined'}
            </Text>
            <Text style={styles.debugText}>
              matchStats.message: {matchStats.message || 'no message'}
            </Text>
            <Text style={styles.noDataText}>Aucune donnée disponible</Text>
          </View>
        );
      }

      return (
        <>
          {/* Statistiques globales */}
          <View style={styles.globalStatsContainer}>
            <Text style={styles.sectionTitle}>📈 Statistiques Globales</Text>
            <View style={styles.globalStatsRow}>
              <View style={styles.globalStatItem}>
                <Text style={styles.globalStatNumber}>
                  {matchStats.match?.total_qr_codes || 'N/A'}
                </Text>
                <Text style={styles.globalStatLabel}>Total Accés</Text>
              </View>
              <View style={styles.globalStatItem}>
                <Text style={styles.globalStatNumber}>
                  {matchStats.match?.used_qr_codes || 'N/A'}
                </Text>
                <Text style={styles.globalStatLabel}>Total Success</Text>
              </View>
              <View style={styles.globalStatItem}>
                <Text style={styles.globalStatNumber}>
                  {matchStats.match?.fraud_qr_codes || 'N/A'}
                </Text>
                <Text style={styles.globalStatLabel}>Total Fraude</Text>
              </View>
            </View>
          </View>

          {/* Statistiques par zone */}
          <View style={styles.zonesStatsContainer}>
            <Text style={styles.sectionTitle}>🏟️ Statistiques par Zone</Text>
            {matchStats.zones && matchStats.zones.length > 0 ? (
              matchStats.zones.map((zone: ZoneStats, index: number) => (
                <View key={index} style={styles.zoneCard}>
                  <Text style={styles.zoneName}>{zone.zone || 'Zone inconnue'}</Text>
                  <View style={styles.zoneStatsRow}>
                    <View style={styles.zoneStatItem}>
                      <Text style={styles.zoneStatNumber}>
                        {zone.total_qrcodes || 'N/A'}
                      </Text>
                      <Text style={styles.zoneStatLabel}>Accés</Text>
                    </View>
                    <View style={styles.zoneStatItem}>
                      <Text style={styles.zoneStatNumber}>
                        {zone.used_qrcodes || 'N/A'}
                      </Text>
                      <Text style={styles.zoneStatLabel}>Success</Text>
                    </View>
                    <View style={styles.zoneStatItem}>
                      <Text style={styles.zoneStatNumber}>
                        {zone.fraud_qrcodes || 'N/A'}
                      </Text>
                      <Text style={styles.zoneStatLabel}>Fraude</Text>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noDataText}>Aucune donnée de zone disponible</Text>
            )}
          </View>

          {/* Résumé des statistiques */}
          {matchStats.summary && (
            <View style={styles.summaryContainer}>
              <Text style={styles.sectionTitle}>📋 Résumé</Text>
              <View style={styles.summaryCard}>
                {matchStats.summary.most_used_zone && (
                  <Text style={styles.summaryText}>
                    🏆 Zone la plus utilisée: {matchStats.summary.most_used_zone.zone} ({matchStats.summary.most_used_zone.usage_percentage?.toFixed(1) || 'N/A'}%)
                  </Text>
                )}
                {matchStats.summary.least_used_zone && (
                  <Text style={styles.summaryText}>
                    📉 Zone la moins utilisée: {matchStats.summary.least_used_zone.zone} ({matchStats.summary.least_used_zone.usage_percentage?.toFixed(1) || 'N/A'}%)
                  </Text>
                )}
                {matchStats.summary.highest_fraud_zone && (
                  <Text style={styles.summaryText}>
                    ⚠️ Zone avec le plus de fraude: {matchStats.summary.highest_fraud_zone.zone} ({matchStats.summary.highest_fraud_zone.fraud_percentage?.toFixed(1) || 'N/A'}%)
                  </Text>
                )}
                <Text style={styles.summaryText}>
                  📊 Total des zones: {matchStats.summary.total_zones || 'N/A'} | Avec données: {matchStats.summary.zones_with_data || 'N/A'}
                </Text>
              </View>
            </View>
          )}
        </>
      );
    } catch (error) {
      console.error('Erreur lors du rendu des statistiques:', error);
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            ❌ Erreur lors de l'affichage des statistiques: {error instanceof Error ? error.message : 'Erreur inconnue'}
          </Text>
        </View>
      );
    }
  };


  const handleLogout = () => {
    try {
      console.log('Tentative de déconnexion...');
      
      // Supprimer le token et les données utilisateur du stockage
      AsyncStorage.multiRemove(['auth_token', 'user_data']);
      console.log('Token et données supprimés du stockage');
      
      // Appeler la fonction logout du contexte pour réinitialiser l'état
      logout();
      console.log('Déconnexion réussie');
      
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      
      // En cas d'erreur, forcer la suppression du stockage
      try {
        AsyncStorage.multiRemove(['auth_token', 'user_data']);
        console.log('Suppression forcée du token');
      } catch (storageError) {
        console.error('Erreur lors de la suppression du stockage:', storageError);
      }
    } finally {
      // Redirection vers la page de login
      console.log('Redirection vers login...');
      router.replace('/login');
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    //Format: "2025-09-28 15:30:00" -> "28/09/2025"
    const datePart = dateString.split(' ')[0]; // Récupère "2025-09-28"
    if (datePart) {
      const date = new Date(datePart);
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    return 'N/A';
  };



  const getStatusColor = (status: string | undefined) => {
    if (!status) return '#95a5a6';
    switch (status.toLowerCase()) {
      case 'en cours':
        return '#e74c3c';
      case 'finished':
        return '#95a5a6';
      case 'upcoming':
        return '#27ae60';
      default:
        return '#3498db';
    }
  };


  const renderMatch = ({ item }: { item: Match }) => {
    const isUpcoming = item.status?.toLowerCase() === 'upcoming';
    const isActive = item.status?.toLowerCase() === 'active';
    const isFinished = item.status?.toLowerCase() === 'finished';
    const canViewStats = isActive || isFinished;
    
    return (
      <TouchableOpacity
        style={styles.matchCard}
        onPress={() => {
          if (isActive) {
            router.push(`/scan/${item.id}`);
          }
        }}
        disabled={!isActive}
      >
        <View style={styles.matchHeader}>
          <View>
          </View>
        </View>
        
        <View style={styles.teamsContainer}>
          <View style={styles.teamContainer}>
            {item.homeTeam_logo && (
              <Image 
                source={{ uri: item.homeTeam_logo }} 
                style={styles.teamLogo}
                resizeMode="contain"
              />
            )}
            <Text style={styles.teamName}>{item.homeTeam || 'Équipe à domicile'}</Text>
          </View>
          
          <Text style={styles.vsText}>VS</Text>
          
          <View style={styles.teamContainer}>
            {item.awayTeam_logo && (
              <Image 
                source={{ uri: item.awayTeam_logo }} 
                style={styles.teamLogo}
                resizeMode="contain"
              />
            )}
            <Text style={styles.teamName}>{item.awayTeam || 'Équipe à l\'extérieur'}</Text>
          </View>
        </View>

        <View style={styles.accessInfo}>
            <Text style={styles.accessText}>
              📅 {(item.date)}
            </Text>
            <Text style={styles.accessText}>
              ⏰ {(item.time)}
            </Text>
            <Text style={styles.accessText}>🏟️ {item.stadium || 'Stade non spécifié'}</Text>

        </View>
        
        {/* Affichage conditionnel selon le statut */}
        {isUpcoming && item.dateTimeScann && (
          <View style={styles.accessInfo}>
            <Text style={styles.accessText}>
              📅 Accès activé à: {(item.dateTimeScann)} 
            </Text>
          </View>
        )}
        
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[
              styles.scanButton, 
              !isActive && styles.scanButtonDisabled
            ]}
            onPress={() => {
              if (isActive) {
                router.push(`/scan/${item.id}`);
              }
            }}
            disabled={!isActive}
          >
            <Text style={[
              styles.scanButtonText,
              !isActive && styles.scanButtonTextDisabled
            ]}>
              {isActive ? 'Scan activé' : 'Scan désactivé'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.statsButton,
              !canViewStats && styles.statsButtonDisabled
            ]}
            onPress={() => {
              if (canViewStats) {
                handleViewStats(item);
              }
            }}
            disabled={!canViewStats}
          >
            <Text style={[
              styles.statsButtonText,
              !canViewStats && styles.statsButtonTextDisabled
            ]}>
              {canViewStats ? '📊 Statistiques' : '📊 Stats indisponibles'}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Chargement des matchs...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Club Africain</Text>
        <View style={styles.headerButtons}>
          {Platform.OS === 'web' && (
            <>
              <TouchableOpacity onPress={loadMatches} style={styles.testButton}>
                <Text style={styles.testButtonText}>🔄 Test API</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                if (matches.length > 0) {
                  handleViewStats(matches[0]);
                } else {
                  Alert.alert('Info', 'Aucun match disponible pour tester les statistiques');
                }
              }} style={styles.testButton}>
                <Text style={styles.testButtonText}>📊 Test Stats</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Navbar Mobile */}
      <View style={styles.navbar}>
        <View style={styles.navbarContent}>
          <TouchableOpacity
            style={[styles.navItem, activeTab === 'upcoming' && styles.navItemActive]}
            onPress={() => setActiveTab('upcoming')}
          >
            <Text style={styles.navIcon}>⚽</Text>
            <Text style={[styles.navText, activeTab === 'upcoming' && styles.navTextActive]}>
              À venir
            </Text>
            <View style={[styles.navBadge, activeTab === 'upcoming' && styles.navBadgeActive]}>
              <Text style={[styles.navBadgeText, activeTab === 'upcoming' && styles.navBadgeTextActive]}>
                {upcomingMatches.length}
              </Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.navItem, activeTab === 'finished' && styles.navItemActive]}
            onPress={() => setActiveTab('finished')}
          >
            <Text style={styles.navIcon}>🏁</Text>
            <Text style={[styles.navText, activeTab === 'finished' && styles.navTextActive]}>
              Terminés
            </Text>
            <View style={[styles.navBadge, activeTab === 'finished' && styles.navBadgeActive]}>
              <Text style={[styles.navBadgeText, activeTab === 'finished' && styles.navBadgeTextActive]}>
                {finishedMatches.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.apiInfo}>
        <Text style={styles.apiInfoText}>
          📡 API: {matches.length} match(s) chargé(s) 
        </Text>
        <Text style={styles.debugText}>
          🔍 Debug: Token présent: {token ? 'Oui' : 'Non'} | Loading: {loading ? 'Oui' : 'Non'}
        </Text>
        {matches.length > 0 && (
          <Text style={styles.debugText}>
            📋 Premier match: {matches[0]?.homeTeam || 'N/A'} vs {matches[0]?.awayTeam || 'N/A'}
          </Text>
        )}
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={loadMatches} style={styles.retryButton}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#e74c3c']}
              tintColor="#e74c3c"
            />
          }
        >
          {/* Contenu selon l'onglet actif */}
          {activeTab === 'upcoming' ? (
            <View style={styles.matchesSection}>
              {upcomingMatches.length > 0 ? (
                upcomingMatches.map((match) => (
                  <View key={match.id}>
                    {renderMatch({ item: match })}
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Aucun match à venir</Text>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.matchesSection}>
              {finishedMatches.length > 0 ? (
                finishedMatches.map((match) => (
                  <View key={match.id}>
                    {renderMatch({ item: match })}
                  </View>
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>Aucun match terminé</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      )}

      {/* Modal des statistiques */}
      <Modal
        visible={statsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setStatsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                📊 Statistiques du match
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setStatsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            {selectedMatch && (
              <View style={styles.matchInfo}>
                <Text style={styles.matchTitle}>
                  {selectedMatch.homeTeam} vs {selectedMatch.awayTeam}
                </Text>
                <Text style={styles.matchDate}>
                  📅 {selectedMatch.date} - ⏰ {selectedMatch.time}
                </Text>
                <Text style={styles.matchStadium}>
                  🏟️ {selectedMatch.stadium}
                </Text>
              </View>
            )}

            {loadingStats ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#e74c3c" />
                <Text style={styles.loadingText}>Chargement des statistiques...</Text>
              </View>
            ) : matchStats ? (
              <ScrollView style={styles.statsContainer}>
                {renderStatsContent()}
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'web' ? 20 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbar: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navbarContent: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  navItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  navItemActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#c0392b',
    shadowColor: '#e74c3c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  navIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  navText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6c757d',
    marginRight: 8,
  },
  navTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  navBadge: {
    backgroundColor: '#dee2e6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  navBadgeActive: {
    backgroundColor: '#fff',
  },
  navBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6c757d',
  },
  navBadgeTextActive: {
    color: '#e74c3c',
  },
  testButton: {
    padding: 8,
    marginRight: 10,
    backgroundColor: '#3498db',
    borderRadius: 6,
  },
  testButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  apiInfo: {
    backgroundColor: '#e8f5e8',
    padding: 8,
    marginHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
    borderRadius: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  apiInfoText: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: '500',
    textAlign: 'center',
  },
  debugText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  matchesSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  matchCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamLogo: {
    width: 40,
    height: 40,
    marginBottom: 8,
    borderRadius: 20,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  vsText: {
    fontSize: 14,
    color: '#666',
    marginHorizontal: 16,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  stadiumText: {
    fontSize: 14,
    color: '#666',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  scanButton: {
    backgroundColor: '#e74c3c',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  scanButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  scanButtonTextDisabled: {
    color: '#7f8c8d',
  },
  statsButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
  },
  statsButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  statsButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  statsButtonTextDisabled: {
    color: '#7f8c8d',
  },
  accessInfo: {
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  accessText: {
    color: '#856404',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  // Styles pour le modal des statistiques
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    flex: 1,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  matchInfo: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  matchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  matchDate: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  matchStadium: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  statsContainer: {
    maxHeight: 400,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
    textAlign: 'center',
  },
  globalStatsContainer: {
    backgroundColor: '#e8f5e8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  globalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  globalStatItem: {
    alignItems: 'center',
  },
  globalStatNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 4,
  },
  globalStatLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  zonesStatsContainer: {
    marginBottom: 20,
  },
  zoneCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  zoneName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  zoneStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  zoneStatItem: {
    alignItems: 'center',
  },
  zoneStatNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  zoneStatLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  summaryContainer: {
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#f0f8ff',
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  summaryText: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 8,
    fontWeight: '500',
  },
});
