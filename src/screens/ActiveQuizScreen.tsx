import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, QuizResult } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'ActiveQuiz'>;
type Route = RouteProp<RootStackParamList, 'ActiveQuiz'>;

export default function ActiveQuizScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { quiz } = route.params;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [identificationAnswer, setIdentificationAnswer] = useState('');
  const [answers, setAnswers] = useState<QuizResult[]>([]);

  const currentQ = quiz.questions[currentIndex];
  const isLast = currentIndex === quiz.questions.length - 1;
  const isMC = currentQ.type === 'multiple_choice';

  const handleNext = () => {
    const userAnswer = isMC
      ? (selectedAnswer ?? '')
      : identificationAnswer.trim();

    if (!userAnswer) {
      Alert.alert('Answer required', 'Please select or type an answer before continuing.');
      return;
    }

    const result: QuizResult = {
      questionId: currentQ.id,
      userAnswer,
      correctAnswer: currentQ.correctAnswer,
      isCorrect: userAnswer.toLowerCase() === currentQ.correctAnswer.toLowerCase(),
    };

    const newAnswers = [...answers, result];

    if (isLast) {
      navigation.replace('QuizResults', { results: newAnswers, quiz });
    } else {
      setAnswers(newAnswers);
      setCurrentIndex(i => i + 1);
      setSelectedAnswer(null);
      setIdentificationAnswer('');
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
      setSelectedAnswer(null);
      setIdentificationAnswer('');
      setAnswers(prev => prev.slice(0, -1));
    }
  };

  const optionColors: Record<string, string> = {
    A: '#A8E6EF',
    B: '#A8E6EF',
    C: '#A8E6EF',
    D: '#A8E6EF',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#C5F5FA" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PA-NOTE</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* Progress */}
        <View style={styles.progressRow}>
          <Text style={styles.progressText}>
            Question {currentIndex + 1} of {quiz.questions.length}
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` },
              ]}
            />
          </View>
        </View>

        {/* Question area */}
        <View style={styles.questionCard}>
          <Text style={styles.questionType}>
            {isMC ? '🔵 Multiple Choice' : '✏️ Identification'}
          </Text>
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </View>

        {/* Options / Text Input */}
        {isMC ? (
          <View style={styles.optionsGrid}>
            {currentQ.options?.map(opt => {
              const isSelected = selectedAnswer === opt.text;
              return (
                <TouchableOpacity
                  key={opt.label}
                  style={[
                    styles.optionBtn,
                    { backgroundColor: isSelected ? '#0B4A8E' : optionColors[opt.label] },
                  ]}
                  onPress={() => setSelectedAnswer(opt.text)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.optionLabel, isSelected && { color: '#fff' }]}>
                    {opt.label}
                  </Text>
                  <Text style={[styles.optionText, isSelected && { color: '#fff' }]} numberOfLines={2}>
                    {opt.text}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <TextInput
            style={styles.identificationInput}
            placeholder="Type your answer here..."
            placeholderTextColor="#8BBDD9"
            value={identificationAnswer}
            onChangeText={setIdentificationAnswer}
            multiline
          />
        )}
      </ScrollView>

      {/* Navigation row */}
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={styles.navBtnText}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitBtn} onPress={handleNext}>
          <Text style={styles.submitBtnText}>
            {isLast ? '✔  Submit' : '✔'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, isLast && styles.navBtnDisabled]}
          onPress={() => {
            if (!isLast) {
              setCurrentIndex(i => i + 1);
              setSelectedAnswer(null);
              setIdentificationAnswer('');
            }
          }}
          disabled={isLast}
        >
          <Text style={styles.navBtnText}>›</Text>
        </TouchableOpacity>
      </View>
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
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 26,
    color: '#0B4A8E',
    lineHeight: 28,
    marginRight: 2,
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
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  progressRow: {
    marginBottom: 16,
  },
  progressText: {
    fontSize: 12,
    color: '#5A8BAA',
    fontWeight: '600',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#A8E6EF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    backgroundColor: '#0B4A8E',
    borderRadius: 10,
  },
  questionCard: {
    backgroundColor: '#EAF9FB',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    marginBottom: 20,
    minHeight: 140,
  },
  questionType: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5A8BAA',
    marginBottom: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B4A8E',
    lineHeight: 24,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionBtn: {
    width: '47%',
    borderRadius: 12,
    padding: 14,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7ED6E0',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B4A8E',
    marginBottom: 4,
  },
  optionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#0B4A8E',
    textAlign: 'center',
  },
  identificationInput: {
    backgroundColor: '#EAF9FB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A8E6EF',
    padding: 14,
    fontSize: 14,
    color: '#0B4A8E',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#A8E6EF',
    borderTopWidth: 1,
    borderTopColor: '#7ED6E0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  navBtn: {
    backgroundColor: '#D8F4F8',
    borderRadius: 30,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7ED6E0',
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  navBtnText: {
    fontSize: 22,
    color: '#0B4A8E',
    fontWeight: '700',
    lineHeight: 26,
  },
  submitBtn: {
    backgroundColor: '#0B4A8E',
    borderRadius: 30,
    paddingHorizontal: 28,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
