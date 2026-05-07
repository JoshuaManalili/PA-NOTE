import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
}

export default function NoteCard({ note, onPress }: NoteCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Text style={styles.title} numberOfLines={1}>{note.title}</Text>
      </View>
      <Text style={styles.date}>{note.createdAt}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D8F4F8',
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    shadowColor: '#0B4A8E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B4A8E',
    flex: 1,
  },
  date: {
    fontSize: 11,
    color: '#5A8BAA',
    marginTop: 3,
  },
});
