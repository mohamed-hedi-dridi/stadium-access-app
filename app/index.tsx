import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts';

export default function IndexScreen() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        // Utilisateur connecté, rediriger vers les matchs
        router.replace('/matches');
      } else {
        // Utilisateur non connecté, rediriger vers la connexion
        router.replace('/login');
      }
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  return null; // Cette page ne s'affiche jamais car on redirige toujours
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
