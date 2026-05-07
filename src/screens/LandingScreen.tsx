import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';
import NoteCard from '../components/NoteCard';
import HamburgerMenu from '../components/HamburgerMenu';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

const MIN_SUBJECT_LENGTH = 100;

export default function LandingScreen() {
  const navigation = useNavigation<Nav>();
  const { notes, addNote } = useAppContext();

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'quiz'>('notes');
  const [menuVisible, setMenuVisible] = useState(false);

  const handleAddNote = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title for your note.');
      return;
    }
    if (!subject.trim()) {
      Alert.alert('Subject required', 'Please enter the subject/content of your note.');
      return;
    }
    if (subject.trim().length < MIN_SUBJECT_LENGTH) {
      Alert.alert(
        'Subject too short',
        `Subject must be at least ${MIN_SUBJECT_LENGTH} characters. Currently: ${subject.trim().length}`
      );
      return;
    }
    addNote(title.trim(), subject.trim());
    setTitle('');
    setSubject('');
  };

  const handleMicPress = () => {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please enter a title before recording.');
      return;
    }
    if (isRecording) {
      // Stop recording → simulate transcription
      setIsRecording(false);
      setTranscribing(true);
      setTimeout(() => {
        setTranscribing(false);
        setSubject(prev =>
          prev
            ? prev + ' This is simulated transcribed speech from the voice recording.'
            : 'This is simulated transcribed speech from the voice recording. You can edit this text to correct any errors made during transcription.'
        );
      }, 1500);
    } else {
      setIsRecording(true);
      setSubject('');
    }
  };

  const charCount = subject.trim().length;
  const charColor = charCount >= MIN_SUBJECT_LENGTH ? '#27AE60' : '#E05C5C';

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

      {/* Fixed Top Section */}
      <View style={styles.topSection}>
        {/* Tab Switcher */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'notes' && styles.tabActive]}
            onPress={() => setActiveTab('notes')}
          >
            <Text style={[styles.tabText, activeTab === 'notes' && styles.tabTextActive]}>Notes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'quiz' && styles.tabActive]}
            onPress={() => navigation.navigate('QuizList')}
          >
            <Text style={[styles.tabText, activeTab === 'quiz' && styles.tabTextActive]}>Quiz</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'notes' && (
          <View style={styles.formArea}>
            {/* Subject big input */}
            <View style={styles.subjectWrapper}>
              <TextInput
                style={styles.subjectInput}
                placeholder="Add text here"
                placeholderTextColor="#8BBDD9"
                multiline
                value={
                  isRecording
                    ? '🎙 Recording... speak now'
                    : transcribing
                    ? '⏳ Transcribing...'
                    : subject
                }
                onChangeText={setSubject}
                editable={!isRecording && !transcribing}
                textAlignVertical="top"
              />
            </View>

            {/* Title row */}
            <View style={styles.titleRow}>
              <TextInput
                style={styles.titleInput}
                placeholder="Title"
                placeholderTextColor="#8BBDD9"
                value={title}
                onChangeText={setTitle}
                editable={!isRecording}
              />
              {/* Mic button */}
              <TouchableOpacity
                style={[styles.micBtn, isRecording && styles.micBtnActive, !title.trim() && styles.micBtnDisabled]}
                onPress={handleMicPress}
              >
                <Text style={styles.micIcon}>{isRecording ? '⏹' : '🎙'}</Text>
              </TouchableOpacity>
            </View>

            {/* Char count + Done button */}
            <View style={styles.formFooter}>
              <Text style={[styles.charCount, { color: charColor }]}>
                {charCount}/{MIN_SUBJECT_LENGTH} chars
              </Text>
              <TouchableOpacity style={styles.doneBtn} onPress={handleAddNote}>
                <Text style={styles.doneBtnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Scrollable Notes List */}
      {activeTab === 'notes' && (
        <FlatList
          data={notes}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() => navigation.navigate('NoteDetail', { note: item })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📝</Text>
              <Text style={styles.emptyText}>No notes yet.</Text>
              <Text style={styles.emptySubText}>Add your first note above!</Text>
            </View>
          }
        />
      )}

      {/* Bottom Toolbar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.toolbarBtn}>
          <Text style={styles.toolbarIcon}>📷</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toolbarBtn, styles.toolbarBtnActive]}
          onPress={handleMicPress}
        >
          <Text style={styles.toolbarIcon}>{isRecording ? '⏹' : '🎙'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarBtn}>
          <Text style={styles.toolbarIcon}>📋</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarBtn} onPress={() => navigation.navigate('QuizList')}>
          <Text style={styles.toolbarIcon}>📊</Text>
        </TouchableOpacity>
      </View>

      <HamburgerMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNavigate={(screen) => navigation.navigate(screen as keyof RootStackParamList)}
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
    backgroundColor: '#C5F5FA',
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
  topSection: {
    backgroundColor: '#C5F5FA',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  tabRow: {
    flexDirection: 'row',
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
  },
  formArea: {
    backgroundColor: '#D8F4F8',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#A8E6EF',
  },
  subjectWrapper: {
    backgroundColor: '#EAF9FB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    minHeight: 80,
    padding: 10,
    marginBottom: 10,
  },
  subjectInput: {
    minHeight: 70,
    fontSize: 13,
    color: '#0B4A8E',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  titleInput: {
    flex: 1,
    backgroundColor: '#EAF9FB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 14,
    color: '#0B4A8E',
  },
  micBtn: {
    backgroundColor: '#A8E6EF',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micBtnActive: {
    backgroundColor: '#FF6B6B',
  },
  micBtnDisabled: {
    opacity: 0.4,
  },
  micIcon: {
    fontSize: 18,
  },
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  charCount: {
    fontSize: 11,
    fontWeight: '600',
  },
  doneBtn: {
    backgroundColor: '#0B4A8E',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  doneBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B4A8E',
  },
  emptySubText: {
    fontSize: 13,
    color: '#5A8BAA',
    marginTop: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#A8E6EF',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#7ED6E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  toolbarBtn: {
    padding: 8,
    borderRadius: 8,
  },
  toolbarBtnActive: {
    backgroundColor: '#D8F4F8',
  },
  toolbarIcon: {
    fontSize: 22,
  },
});
