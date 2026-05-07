import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ArchivesScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Archives coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#C5F5FA' },
  text: { fontSize: 18, color: '#0B4A8E' },
});
