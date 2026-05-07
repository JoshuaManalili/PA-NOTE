import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useAppContext } from '../context/AppContext';
import PrimaryButton from '../components/PrimaryButton';

type Nav = NativeStackNavigationProp<RootStackParamList, 'NoteDetail'>;
type Route = RouteProp<RootStackParamList, 'NoteDetail'>;

export default function NoteDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { note } = route.params;
  const { deleteNote, updateNote } = useAppContext();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [subject, setSubject] = useState(note.subject);

  const handleSave = () => {
    if (!title.trim() || !subject.trim()) {
      Alert.alert('Validation', 'Title and subject cannot be empty.');
      return;
    }
    if (subject.trim().length < 100) {
      Alert.alert('Subject too short', 'Subject must be at least 100 characters.');
      return;
    }
    updateNote(note.id, title.trim(), subject.trim());
    setEditing(false);
    Alert.alert('Saved', 'Note updated successfully.');
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNote(note.id);
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#C5F5FA" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PA-NOTE</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editBtn}>{editing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.metaDate}>Created: {note.createdAt}</Text>

          {editing ? (
            <>
              <TextInput
                style={styles.titleEdit}
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
                placeholderTextColor="#8BBDD9"
              />
              <TextInput
                style={styles.subjectEdit}
                value={subject}
                onChangeText={setSubject}
                placeholder="Subject"
                placeholderTextColor="#8BBDD9"
                multiline
                textAlignVertical="top"
              />
              <Text style={[styles.charCount, subject.trim().length >= 100 ? styles.charOk : styles.charErr]}>
                {subject.trim().length}/100 characters
              </Text>
              <PrimaryButton label="Save Changes" onPress={handleSave} style={styles.saveBtn} />
            </>
          ) : (
            <>
              <Text style={styles.title}>{note.title}</Text>
              <View style={styles.divider} />
              <Text style={styles.subject}>{note.subject}</Text>
            </>
          )}
        </View>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>🗑  Delete Note</Text>
        </TouchableOpacity>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#C5F5FA',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#0B4A8E',
    marginRight: 2,
    lineHeight: 28,
  },
  backText: {
    fontSize: 15,
    color: '#0B4A8E',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B4A8E',
    letterSpacing: 1,
  },
  editBtn: {
    fontSize: 14,
    color: '#0B4A8E',
    fontWeight: '600',
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#EAF9FB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    shadowColor: '#0B4A8E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  metaDate: {
    fontSize: 11,
    color: '#5A8BAA',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B4A8E',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#A8E6EF',
    marginBottom: 14,
  },
  subject: {
    fontSize: 15,
    color: '#1A4A6E',
    lineHeight: 24,
  },
  titleEdit: {
    backgroundColor: '#D8F4F8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '700',
    color: '#0B4A8E',
    marginBottom: 12,
  },
  subjectEdit: {
    backgroundColor: '#D8F4F8',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0B4A8E',
    minHeight: 200,
    marginBottom: 6,
  },
  charCount: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 12,
  },
  charOk: { color: '#27AE60' },
  charErr: { color: '#E05C5C' },
  saveBtn: {
    marginTop: 4,
  },
  deleteBtn: {
    marginTop: 20,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E05C5C',
  },
  deleteBtnText: {
    color: '#E05C5C',
    fontWeight: '700',
    fontSize: 14,
  },
});
