import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Quiz } from '../types';

interface QuizCardProps {
  quiz: Quiz;
  onPress: () => void;
}

export default function QuizCard({ quiz, onPress }: QuizCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.title} numberOfLines={1}>{quiz.noteTitle}</Text>
      <Text style={styles.preview} numberOfLines={2}>{quiz.notePreview}</Text>
      <View style={styles.footer}>
        <Text style={styles.meta}>{quiz.questions.length} questions</Text>
        <Text style={styles.date}>{new Date(quiz.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#D8F4F8',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    shadowColor: '#0B4A8E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B4A8E',
    marginBottom: 4,
  },
  preview: {
    fontSize: 12,
    color: '#4A7A99',
    lineHeight: 18,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 11,
    color: '#0B4A8E',
    fontWeight: '600',
    backgroundColor: '#B0E8F0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  date: {
    fontSize: 11,
    color: '#5A8BAA',
  },
});
