import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { Card, Badge, StatTile } from '../components/ui';
import { MaterialIcon, MATERIALS } from '../components/MaterialIcon';
import { useI18n } from '../i18n/i18n';
import { useApp } from '../store/AppState';
import { passportSteps } from '../data/mock';
import { colors, gradients, radius, spacing, shadow, materialColor } from '../theme/theme';

// Иконки этапов пути отхода
const STEP_ICONS = ['hand-heart-outline', 'robot-outline', 'truck-fast-outline', 'sort-variant', 'recycle'];

function PassportCard({ entry, onOpen, t }) {
  const done = entry.stepIndex >= 4;
  return (
    <Pressable onPress={() => onOpen(entry)}>
      <Card style={styles.pCard}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <MaterialIcon material={entry.material} size={48} />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.pLabel}>{entry.label}</Text>
            <Text style={styles.pId}>
              {t('passport_id')}: {entry.id}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.pWeight}>{entry.weightKg} {t('kg')}</Text>
            <Text style={styles.pDate}>{entry.date}</Text>
          </View>
        </View>

        {/* Мини-трекер прогресса */}
        <View style={styles.miniTrack}>
          {passportSteps.map((_, i) => (
            <View key={i} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={[
                  styles.miniDot,
                  i <= entry.stepIndex
                    ? { backgroundColor: materialColor(entry.material) }
                    : { backgroundColor: colors.border },
                ]}
              />
              {i < passportSteps.length - 1 ? (
                <View
                  style={[
                    styles.miniSeg,
                    i < entry.stepIndex ? { backgroundColor: materialColor(entry.material) } : null,
                  ]}
                />
              ) : null}
            </View>
          ))}
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
          <Badge
            label={done ? t('passport_step_recycled') : t('passport_pending')}
            color={done ? colors.green600 : colors.sun}
          />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.trackLink}>{t('passport_track')}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.green600} />
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

function TrackModal({ entry, onClose, t }) {
  if (!entry) return null;
  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <MaterialIcon material={entry.material} size={44} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.modalTitle}>{entry.label}</Text>
                <Text style={styles.modalId}>{entry.id}</Text>
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close-circle" size={30} color={colors.textFaint} />
            </Pressable>
          </View>

          <Text style={styles.trackTitle}>{t('passport_track')}</Text>

          {/* Вертикальная временная шкала */}
          <View style={{ marginTop: 8 }}>
            {passportSteps.map((step, i) => {
              const reached = i <= entry.stepIndex;
              const active = i === entry.stepIndex;
              return (
                <View key={step} style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        reached
                          ? { backgroundColor: materialColor(entry.material) }
                          : { backgroundColor: colors.surfaceAlt, borderWidth: 2, borderColor: colors.border },
                      ]}
                    >
                      <MaterialCommunityIcons
                        name={STEP_ICONS[i]}
                        size={18}
                        color={reached ? '#fff' : colors.textFaint}
                      />
                    </View>
                    {i < passportSteps.length - 1 ? (
                      <View
                        style={[
                          styles.timelineLine,
                          i < entry.stepIndex ? { backgroundColor: materialColor(entry.material) } : null,
                        ]}
                      />
                    ) : null}
                  </View>
                  <View style={{ flex: 1, paddingBottom: 24 }}>
                    <Text style={[styles.stepName, reached && { color: colors.text }]}>{t(step)}</Text>
                    {active && !reachedFinal(entry) ? (
                      <View style={styles.liveTag}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>{t('passport_pending')}</Text>
                      </View>
                    ) : null}
                    {i === 4 && entry.verifiedBy ? (
                      <Text style={styles.verifiedBy}>
                        {t('passport_verified_by')}: {entry.verifiedBy}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            })}
          </View>

          {/* Вклад */}
          <LinearGradient colors={gradients.mint} style={styles.contribCard}>
            <MaterialCommunityIcons name="earth" size={26} color="#fff" />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.contribTitle}>{t('passport_contribution')}</Text>
              <Text style={styles.contribValue}>
                −{Math.round(entry.weightKg * 1.7 * 10) / 10} кг CO₂
              </Text>
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const reachedFinal = (entry) => entry.stepIndex >= 4;

export default function PassportScreen() {
  const { t } = useI18n();
  const { passport, stats } = useApp();
  const [selected, setSelected] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']}>
        <View style={{ height: 8 }} />
        <AppHeader title={t('passport_title')} subtitle={t('passport_subtitle')} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Сводка */}
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.summary, shadow.card]}>
          <View style={styles.summaryRow}>
            <SummaryStat value={stats.total} label={t('passport_total')} />
            <View style={styles.summaryDivider} />
            <SummaryStat value={stats.recycled} label={t('passport_verified')} />
            <View style={styles.summaryDivider} />
            <SummaryStat value={`${stats.co2}`} label="CO₂ кг" />
          </View>
        </LinearGradient>

        {passport.length === 0 ? (
          <Card style={{ alignItems: 'center', paddingVertical: 40, marginTop: 20 }}>
            <MaterialCommunityIcons name="card-account-details-outline" size={48} color={colors.textFaint} />
            <Text style={styles.empty}>{t('passport_empty')}</Text>
          </Card>
        ) : (
          <View style={{ marginTop: 20, gap: 12 }}>
            {passport.map((e) => (
              <PassportCard key={e.id} entry={e} onOpen={setSelected} t={t} />
            ))}
          </View>
        )}
      </ScrollView>

      <TrackModal entry={selected} onClose={() => setSelected(null)} t={t} />
    </View>
  );
}

function SummaryStat({ value, label }) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.summaryValue}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: { borderRadius: radius.xl, padding: 20 },
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryValue: { color: '#fff', fontSize: 28, fontWeight: '800' },
  summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600', marginTop: 2, textAlign: 'center' },
  summaryDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.22)' },
  pCard: { padding: spacing.lg },
  pLabel: { fontSize: 16, fontWeight: '800', color: colors.text },
  pId: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 2 },
  pWeight: { fontSize: 15, fontWeight: '800', color: colors.green600 },
  pDate: { fontSize: 12, fontWeight: '600', color: colors.textFaint, marginTop: 2 },
  miniTrack: { flexDirection: 'row', alignItems: 'center', marginTop: 16 },
  miniDot: { width: 12, height: 12, borderRadius: 6 },
  miniSeg: { flex: 1, height: 3, backgroundColor: colors.border, marginHorizontal: 2 },
  trackLink: { fontSize: 13, fontWeight: '800', color: colors.green600 },
  empty: { fontSize: 15, fontWeight: '600', color: colors.textMuted, marginTop: 14, textAlign: 'center', paddingHorizontal: 20 },
  // modal
  modalBackdrop: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '88%',
  },
  sheetHandle: {
    width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border,
    alignSelf: 'center', marginBottom: 16,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 19, fontWeight: '800', color: colors.text },
  modalId: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginTop: 1 },
  trackTitle: { fontSize: 16, fontWeight: '800', color: colors.text, marginTop: 24, marginBottom: 6 },
  timelineRow: { flexDirection: 'row' },
  timelineLeft: { alignItems: 'center', width: 40 },
  timelineDot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  timelineLine: { width: 3, flex: 1, backgroundColor: colors.border, marginVertical: 2, minHeight: 20 },
  stepName: { fontSize: 15, fontWeight: '700', color: colors.textFaint, marginTop: 9, marginLeft: 12 },
  liveTag: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 12, marginTop: 6,
    backgroundColor: colors.sun + '22', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start',
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.sun },
  liveText: { fontSize: 12, fontWeight: '800', color: colors.clay },
  verifiedBy: { fontSize: 12.5, fontWeight: '600', color: colors.green600, marginLeft: 12, marginTop: 5 },
  contribCard: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: 16, marginTop: 8 },
  contribTitle: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontWeight: '700' },
  contribValue: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 2 },
});
