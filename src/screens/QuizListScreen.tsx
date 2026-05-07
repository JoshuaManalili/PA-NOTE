import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';
import QuizCard from '../components/QuizCard';
import HamburgerMenu from '../components/HamburgerMenu';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuizList'>;

export default function QuizListScreen() {
  const navigation = useNavigation<Nav>();
  const { quizzes } = useAppContext();
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#C5F5FA" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuBtn} onPress={() => setMenuVisible(true)}>
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
          <View style={styles.menuLine} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PA-NOTE</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab row */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.tabText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.tabActive]}>
          <Text style={styles.tabTextActive}>Quiz</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={quizzes}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <QuizCard
            quiz={item}
            onPress={() => navigation.navigate('ActiveQuiz', { quiz: item })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🧠</Text>
            <Text style={styles.emptyText}>No quizzes yet.</Text>
            <Text style={styles.emptySubText}>Add a note to auto-generate a quiz!</Text>
          </View>
        }
      />

      {/* Floating add-note shortcut */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Main')}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={(screen) => navigation.navigate(screen as any)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#C5F5FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  menuBtn: {
    gap: 4,
    padding: 4,
  },
  menuLine: {
    width: 22,
    height: 2.5,
    backgroundColor: '#0B4A8E',
    borderRadius: 2,
    marginVertical: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B4A8E',
    letterSpacing: 1,
  },
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#A8E6EF',
  },
  tabActive: {
    backgroundColor: '#0B4A8E',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B4A8E',
  },
  tabTextActive: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B4A8E',
  },
  emptySubText: {
    fontSize: 13,
    color: '#5A8BAA',
    marginTop: 6,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#0B4A8E',
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '700',
  },
});
