import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { Card, GradientButton, GhostButton, Chip, ProgressBar } from '../components/ui';
import { useI18n } from '../i18n/i18n';
import { useApp } from '../store/AppState';
import { generateQuiz } from '../services/gemini';
import { colors, gradients, radius, spacing, shadow } from '../theme/theme';

const TOPICS = {
  ru: ['Переработка', 'Пластик', 'Климат', 'Вода', 'Энергия'],
  kz: ['Қайта өңдеу', 'Пластик', 'Климат', 'Су', 'Энергия'],
};

export default function QuizScreen() {
  const { t, lang } = useI18n();
  const { addXp } = useApp();
  const [phase, setPhase] = useState('intro'); // intro | loading | play | done
  const [topic, setTopic] = useState(TOPICS.ru[0]);
  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [error, setError] = useState(null);

  const topics = TOPICS[lang] || TOPICS.ru;

  const start = async () => {
    setPhase('loading');
    setError(null);
    try {
      const qs = await generateQuiz(topic, lang, 5);
      if (!qs.length) throw new Error('empty');
      setQuestions(qs);
      setIdx(0);
      setScore(0);
      setChosen(null);
      setPhase('play');
    } catch (e) {
      setError(e?.message || t('scan_error'));
      setPhase('intro');
    }
  };

  const choose = (i) => {
    if (chosen !== null) return;
    setChosen(i);
    const correct = i === questions[idx].correctIndex;
    if (correct) {
      setScore((s) => s + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    }
  };

  const next = () => {
    if (idx + 1 < questions.length) {
      setIdx((i) => i + 1);
      setChosen(null);
    } else {
      const earned = score * 30;
      addXp(earned);
      setPhase('done');
    }
  };

  // ЭКРАН: интро
  if (phase === 'intro' || phase === 'loading') {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={['top']}>
          <View style={{ height: 8 }} />
          <AppHeader title={t('quiz_title')} subtitle={t('quiz_subtitle')} />
        </SafeAreaView>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <LinearGradient colors={gradients.sun} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.hero, shadow.card]}>
            <View style={styles.heroIcon}>
              <MaterialCommunityIcons name="brain" size={44} color="#fff" />
            </View>
            <Text style={styles.heroTitle}>{t('quiz_title')}</Text>
            <Text style={styles.heroDesc}>{t('quiz_subtitle')}</Text>
          </LinearGradient>

          <Text style={styles.label}>{t('quiz_topic')}</Text>
          <View style={styles.topicRow}>
            {topics.map((tp) => (
              <Chip key={tp} label={tp} active={topic === tp} color={colors.sun} onPress={() => setTopic(tp)} />
            ))}
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <GradientButton
            title={phase === 'loading' ? t('quiz_generating') : t('quiz_start')}
            icon={phase !== 'loading' ? <MaterialCommunityIcons name="play" size={20} color="#fff" /> : null}
            colorsArr={gradients.sun}
            loading={phase === 'loading'}
            onPress={start}
            style={{ marginTop: 28 }}
          />
        </ScrollView>
      </View>
    );
  }

  // ЭКРАН: результат
  if (phase === 'done') {
    const earned = score * 30;
    const pct = score / questions.length;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: 'center' }}>
            <View style={{ alignItems: 'center' }}>
              <LinearGradient colors={gradients.mint} style={styles.resultRing}>
                <Text style={styles.resultScore}>{score}/{questions.length}</Text>
              </LinearGradient>
              <Text style={styles.resultTitle}>{t('quiz_result')}</Text>
              <Text style={styles.resultEarn}>
                {t('quiz_earned')} +{earned} XP
              </Text>
              <View style={{ width: '70%', marginTop: 16 }}>
                <ProgressBar value={pct} color={colors.green500} />
              </View>
            </View>
            <View style={{ marginTop: 40, gap: 12 }}>
              <GradientButton title={t('quiz_again')} onPress={() => setPhase('intro')} colorsArr={gradients.sun} />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // ЭКРАН: игра
  const q = questions[idx];
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']} style={{ flex: 1 }}>
        <View style={styles.quizTop}>
          <Text style={styles.progressText}>
            {t('quiz_question')} {idx + 1} {t('quiz_of')} {questions.length}
          </Text>
          <View style={styles.scorePill}>
            <MaterialCommunityIcons name="star" size={14} color={colors.sun} />
            <Text style={styles.scorePillText}>{score * 30} XP</Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: 20 }}>
          <ProgressBar value={(idx + (chosen !== null ? 1 : 0)) / questions.length} color={colors.sun} />
        </View>

        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <Card style={styles.questionCard}>
            <Text style={styles.question}>{q.question}</Text>
          </Card>

          <View style={{ gap: 12, marginTop: 20 }}>
            {q.options.map((opt, i) => {
              const isCorrect = i === q.correctIndex;
              const isChosen = i === chosen;
              let state = 'idle';
              if (chosen !== null) {
                if (isCorrect) state = 'correct';
                else if (isChosen) state = 'wrong';
              }
              return (
                <Pressable
                  key={i}
                  onPress={() => choose(i)}
                  style={[
                    styles.option,
                    state === 'correct' && styles.optionCorrect,
                    state === 'wrong' && styles.optionWrong,
                  ]}
                >
                  <View
                    style={[
                      styles.optionLetter,
                      state === 'correct' && { backgroundColor: colors.green500 },
                      state === 'wrong' && { backgroundColor: colors.danger },
                    ]}
                  >
                    {state === 'correct' ? (
                      <Ionicons name="checkmark" size={16} color="#fff" />
                    ) : state === 'wrong' ? (
                      <Ionicons name="close" size={16} color="#fff" />
                    ) : (
                      <Text style={styles.optionLetterText}>{String.fromCharCode(65 + i)}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      (state === 'correct' || state === 'wrong') && { color: colors.text, fontWeight: '700' },
                    ]}
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Пояснение после ответа */}
          {chosen !== null && q.explanation ? (
            <Card style={{ marginTop: 16, backgroundColor: colors.mint100 }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <MaterialCommunityIcons
                  name={chosen === q.correctIndex ? 'check-circle-outline' : 'information-outline'}
                  size={20}
                  color={colors.green600}
                />
                <Text style={styles.explanation}>{q.explanation}</Text>
              </View>
            </Card>
          ) : null}

          {chosen !== null ? (
            <GradientButton
              title={idx + 1 < questions.length ? t('quiz_next') : t('quiz_finish')}
              colorsArr={gradients.mint}
              onPress={next}
              style={{ marginTop: 20 }}
            />
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { borderRadius: radius.xl, padding: 28, alignItems: 'center' },
  heroIcon: {
    width: 84, height: 84, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.22)', alignItems: 'center', justifyContent: 'center',
  },
  heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 16 },
  heroDesc: { color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  label: { fontSize: 15, fontWeight: '800', color: colors.text, marginTop: 26, marginBottom: 12 },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 18 },
  errorText: { color: colors.danger, fontWeight: '700', fontSize: 13.5 },
  quizTop: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  progressText: { fontSize: 15, fontWeight: '800', color: colors.text },
  scorePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, ...shadow.soft,
  },
  scorePillText: { fontSize: 13, fontWeight: '800', color: colors.forest800 },
  questionCard: { padding: spacing.xl, marginTop: 8 },
  question: { fontSize: 19, fontWeight: '800', color: colors.text, lineHeight: 26 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.surface, borderRadius: radius.md, padding: 16,
    borderWidth: 2, borderColor: colors.border,
  },
  optionCorrect: { borderColor: colors.green500, backgroundColor: colors.mint100 },
  optionWrong: { borderColor: colors.danger, backgroundColor: '#FDECEC' },
  optionLetter: {
    width: 32, height: 32, borderRadius: 10, backgroundColor: colors.surfaceAlt,
    alignItems: 'center', justifyContent: 'center',
  },
  optionLetterText: { fontSize: 14, fontWeight: '800', color: colors.textMuted },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  explanation: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.forest800, lineHeight: 20 },
  resultRing: {
    width: 150, height: 150, borderRadius: 75, alignItems: 'center', justifyContent: 'center', ...shadow.card,
  },
  resultScore: { color: '#fff', fontSize: 40, fontWeight: '800' },
  resultTitle: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 24 },
  resultEarn: { fontSize: 16, fontWeight: '700', color: colors.green600, marginTop: 6 },
});
