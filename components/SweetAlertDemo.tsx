import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import SweetAlert from './SweetAlert';
import { useSweetAlert } from './useSweetAlert';

const SweetAlertDemo: React.FC = () => {
  const { showSuccess, showError, showWarning, showInfo, showConfirm, alertProps } = useSweetAlert();

  const handleSuccess = async () => {
    await showSuccess(
      '✅ Opération réussie',
      'Votre billet a été scanné avec succès!\n\nSiège: A12\nMatch: Real Madrid vs Barcelona\nAgent: Jean Dupont'
    );
  };

  const handleError = async () => {
    await showError(
      '❌ Erreur de scan',
      'Ce billet n\'est pas valide pour ce match.\n\nVeuillez vérifier le passeport et réessayer.'
    );
  };

  const handleWarning = async () => {
    await showWarning(
      '⚠️ Attention',
      'Ce billet a déjà été scanné.\n\nVérifiez l\'identité du porteur avant de continuer.'
    );
  };

  const handleInfo = async () => {
    await showInfo(
      'ℹ️ Information',
      'Positionnez le code QR du billet dans le cadre de scan.\n\nAssurez-vous que le code est bien visible.'
    );
  };

  const handleConfirm = async () => {
    const confirmed = await showConfirm(
      '❓ Confirmer l\'action',
      'Êtes-vous sûr de vouloir autoriser l\'accès à la caméra?\n\nCette action est nécessaire pour scanner les passeports.'
    );
    
    if (confirmed) {
      await showSuccess('Autorisation accordée', 'L\'accès à la caméra a été autorisé.');
    } else {
      await showInfo('Action annulée', 'L\'accès à la caméra n\'a pas été autorisé.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Démonstration SweetAlert</Text>
      <Text style={styles.subtitle}>Testez les différents types d'alertes</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.successButton]} onPress={handleSuccess}>
          <Text style={styles.buttonText}>✅ Succès</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.errorButton]} onPress={handleError}>
          <Text style={styles.buttonText}>❌ Erreur</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.warningButton]} onPress={handleWarning}>
          <Text style={styles.buttonText}>⚠️ Avertissement</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.infoButton]} onPress={handleInfo}>
          <Text style={styles.buttonText}>ℹ️ Information</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
          <Text style={styles.buttonText}>❓ Confirmation</Text>
        </TouchableOpacity>
      </View>

      <SweetAlert {...alertProps} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successButton: {
    backgroundColor: '#27ae60',
  },
  errorButton: {
    backgroundColor: '#e74c3c',
  },
  warningButton: {
    backgroundColor: '#f39c12',
  },
  infoButton: {
    backgroundColor: '#3498db',
  },
  confirmButton: {
    backgroundColor: '#9b59b6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SweetAlertDemo;
