import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Dimensions
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { scanService } from '../../services/api';
import { useAuth } from '@/contexts';
import SweetAlert from '../../components/SweetAlert';
import { useSweetAlert } from '../../components/useSweetAlert';

const { width, height } = Dimensions.get('window');

export default function ScanScreen() {
  const { matchId } = useLocalSearchParams<{ matchId: string }>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const { token, user } = useAuth();
  const { showSuccess, showError, showWarning, showInfo, showConfirm, alertProps } = useSweetAlert();

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  // Vérifier si la caméra est disponible
  useEffect(() => {
    if (permission?.granted) {
      console.log('Permission caméra accordée');
    } else if (permission?.canAskAgain === false) {
      console.log('Permission caméra refusée définitivement');
    }
  }, [permission]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    setLoading(true);
    
    try {
      
      if (!token) {
        await showError('Erreur', 'Token d\'authentification manquant');
        return;
      }
      console.log('QR Code scanné:', data);
      console.log('Match ID:', matchId);
      console.log('Utilisateur:', user?.name);
      
      if (!matchId) {
        await showError('Erreur', 'ID du match manquant');
        return;
      }
      
      if (!user?.name) {
        await showError('Erreur', 'Nom d\'utilisateur manquant');
        return;
      }
      
      const response = await scanService.scanQR(data, matchId, user.name, token);
      setScanResult(response);
      setShowResult(true);
      
      if (response.success) {
        await showSuccess(
          '✅ Scan Réussi',
          `Passeport scanné avec succès!`
        );
        setScanned(false);
        setShowResult(false);
      } else {
        await showError(
          '❌ Erreur de Scan',
          `⚠️ ${response.message || 'Ce passeport n\'est pas valide pour ce match'}\n\nVeuillez vérifier le passeport et réessayer.`
        );
        setScanned(false);
        setShowResult(false);
      }
    } catch (error) {
      console.error(error);
      await showError(
        '🚨 Erreur Technique',
        '❌ Erreur du scan QrCode.\n\nVérifiez votre connexion internet et réessayez.\n\nSi le problème persiste, contactez le support technique.'
      );
      setScanned(false);
      setShowResult(false);
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    if (!permission?.granted) {
      const confirmed = await showConfirm(
        'Permission requise',
        'L\'accès à la caméra est nécessaire pour scanner les passeports. Veuillez autoriser l\'accès à la caméra.'
      );
      if (confirmed) {
        requestPermission();
      }
      return;
    }
    
    setScanned(false);
    setShowCamera(true);
  };

  const stopScanning = () => {
    setShowCamera(false);
    setScanned(false);
  };

  if (!permission) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Demande d'autorisation caméra...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Autorisation Caméra</Text>
          <Text style={styles.permissionText}>
            Cette application a besoin d'accéder à votre caméra pour scanner les passeports.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Autoriser la caméra</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scanner Passeport</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Instructions de scan</Text>
          <Text style={styles.instructionsText}>
            • Positionnez le code QR du passeport dans le cadre
          </Text>
          <Text style={styles.instructionsText}>
            • Assurez-vous que le code est bien visible
          </Text>
          <Text style={styles.instructionsText}>
            • Attendez la validation automatique
          </Text>
        </View>

        <View style={styles.debugInfo}>
          <Text style={styles.debugInfoText}>
            🔍 Debug: Match ID: {matchId || 'N/A'}
          </Text>
          <Text style={styles.debugInfoText}>
            👤 Agent: {user?.name || 'N/A'}
          </Text>
          <Text style={styles.debugInfoText}>
            🔑 Token: {token ? 'Présent' : 'Manquant'}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.scanButton, loading && styles.scanButtonDisabled]}
          onPress={startScanning}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.scanButtonText}>Démarrer le scan</Text>
          )}
        </TouchableOpacity>

        {scanResult && (
          <View style={[
            styles.resultContainer,
            scanResult.success ? styles.successResult : styles.errorResult
          ]}>
            <Text style={styles.resultTitle}>
              {scanResult.success ? '📋 Dernier scan réussi' : '⚠️ Dernier scan échoué'}
            </Text>
            <Text style={[
              styles.resultText,
              { color: scanResult.success ? '#27ae60' : '#e74c3c' }
            ]}>
              Passeport valide            </Text>
            {scanResult.success && scanResult.ticket && (
              <Text style={styles.resultDetails}>
                Siège: {scanResult.ticket.seatNumber}
              </Text>
            )}
            {!scanResult.success && scanResult.message && (
              <Text style={styles.errorMessage}>
                {scanResult.message}
              </Text>
            )}
            <Text style={styles.resultTimestamp}>
              {new Date().toLocaleTimeString('fr-FR')}
            </Text>
          </View>
        )}
      </View>

      <Modal
        visible={showCamera}
        animationType="slide"
        onRequestClose={stopScanning}
      >
        <View style={styles.cameraContainer}>
          {permission?.granted ? (
            <CameraView
              style={styles.camera}
              facing="back"
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              barcodeScannerSettings={{
                barcodeTypes: ['qr', 'pdf417'],
              }}
            >
              <View style={styles.cameraOverlay}>
              <View style={styles.topOverlay} />
              <View style={styles.middleRow}>
                <View style={styles.sideOverlay} />
                <View style={styles.scanArea}>
                  <View style={styles.scanFrame} />
                </View>
                <View style={styles.sideOverlay} />
              </View>
              <View style={styles.bottomOverlay}>
                <Text style={styles.scanInstructions}>
                  Positionnez le code QR dans le cadre
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={stopScanning}>
                  <Text style={styles.closeButtonText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
            </CameraView>
          ) : (
            <View style={styles.cameraError}>
              <Text style={styles.cameraErrorText}>
                Caméra non disponible
              </Text>
              <TouchableOpacity onPress={requestPermission} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>

      <SweetAlert {...alertProps} />
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
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
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  permissionText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  permissionButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  debugInfo: {
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  debugInfoText: {
    fontSize: 12,
    color: '#3498db',
    marginBottom: 4,
    fontWeight: '500',
  },
  scanButton: {
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  scanButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successResult: {
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
    backgroundColor: '#f8fff8',
  },
  errorResult: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
    backgroundColor: '#fff8f8',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultDetails: {
    fontSize: 14,
    color: '#666',
  },
  errorMessage: {
    fontSize: 14,
    color: '#e74c3c',
    fontStyle: 'italic',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#ffeaea',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  resultTimestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
    textAlign: 'right',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: '#e74c3c',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanInstructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cameraError: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  cameraErrorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
