import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'QuizResults'>;
type Route = RouteProp<RootStackParamList, 'QuizResults'>;

export default function QuizResultsScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { results, quiz } = route.params;

  const totalCorrect = results.filter(r => r.isCorrect).length;
  const total = results.length;
  const percentage = Math.round((totalCorrect / total) * 100);

  const scoreColor =
    percentage >= 80 ? '#27AE60' : percentage >= 60 ? '#F39C12' : '#E05C5C';

  const scoreEmoji =
    percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '😢';

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
        {/* Score card */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreEmoji}>{scoreEmoji}</Text>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={[styles.scoreValue, { color: scoreColor }]}>
            {totalCorrect} / {total}
          </Text>
          <Text style={[styles.scorePercent, { color: scoreColor }]}>
            {percentage}%
          </Text>
          <View style={styles.scoreBar}>
            <View style={[styles.scoreBarFill, { width: `${percentage}%`, backgroundColor: scoreColor }]} />
          </View>
          <Text style={styles.quizTitle}>{quiz.noteTitle}</Text>
        </View>

        {/* Results breakdown */}
        <Text style={styles.sectionLabel}>Answer Review</Text>
        {results.map((result, idx) => {
          const question = quiz.questions.find(q => q.id === result.questionId);
          return (
            <View
              key={result.questionId}
              style={[
                styles.resultItem,
                result.isCorrect ? styles.resultCorrect : styles.resultWrong,
              ]}
            >
              <View style={styles.resultHeader}>
                <Text style={styles.resultNum}>Q{idx + 1}</Text>
                <Text style={styles.resultBadge}>
                  {result.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </Text>
              </View>
              <Text style={styles.resultQuestion}>{question?.question}</Text>
              <View style={styles.resultAnswerRow}>
                <Text style={styles.resultAnswerLabel}>Your answer:</Text>
                <Text style={[styles.resultAnswerText, result.isCorrect ? styles.answerCorrectText : styles.answerWrongText]}>
                  {result.userAnswer || '(no answer)'}
                </Text>
              </View>
              {!result.isCorrect && (
                <View style={styles.resultAnswerRow}>
                  <Text style={styles.resultAnswerLabel}>Correct answer:</Text>
                  <Text style={[styles.resultAnswerText, styles.answerCorrectText]}>
                    {result.correctAnswer}
                  </Text>
                </View>
              )}
            </View>
          );
        })}

        {/* Action buttons */}
        <TouchableOpacity
          style={styles.retakeBtn}
          onPress={() => navigation.replace('ActiveQuiz', { quiz })}
        >
          <Text style={styles.retakeBtnText}>🔄  Retake Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backToQuizBtn}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.backToQuizText}>Back to Quizzes</Text>
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
    paddingBottom: 48,
  },
  scoreCard: {
    backgroundColor: '#EAF9FB',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A8E6EF',
    marginBottom: 24,
    shadowColor: '#0B4A8E',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  scoreEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5A8BAA',
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
  },
  scorePercent: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  scoreBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#A8E6EF',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  scoreBarFill: {
    height: 8,
    borderRadius: 10,
  },
  quizTitle: {
    fontSize: 13,
    color: '#5A8BAA',
    fontWeight: '500',
    textAlign: 'center',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0B4A8E',
    marginBottom: 12,
  },
  resultItem: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  resultCorrect: {
    backgroundColor: '#E8F8F0',
    borderColor: '#A3E4BB',
  },
  resultWrong: {
    backgroundColor: '#FDF0F0',
    borderColor: '#F5BCBC',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultNum: {
    fontSize: 13,
    fontWeight: '700',
    color: '#5A8BAA',
  },
  resultBadge: {
    fontSize: 12,
    fontWeight: '700',
  },
  resultQuestion: {
    fontSize: 14,
    color: '#1A4A6E',
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 10,
  },
  resultAnswerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 2,
  },
  resultAnswerLabel: {
    fontSize: 12,
    color: '#5A8BAA',
    fontWeight: '600',
  },
  resultAnswerText: {
    fontSize: 12,
    fontWeight: '700',
    flexShrink: 1,
  },
  answerCorrectText: {
    color: '#27AE60',
  },
  answerWrongText: {
    color: '#E05C5C',
  },
  retakeBtn: {
    backgroundColor: '#0B4A8E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 10,
  },
  retakeBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  backToQuizBtn: {
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#0B4A8E',
  },
  backToQuizText: {
    color: '#0B4A8E',
    fontWeight: '700',
    fontSize: 15,
  },
});
