import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { SweetAlertDemo } from '../components';

export default function AlertDemoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Démo SweetAlert</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <SweetAlertDemo />
      </ScrollView>
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
  },
});
