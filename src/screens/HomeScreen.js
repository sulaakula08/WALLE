import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogoMark } from '../components/Logo';
import { LangToggle } from '../components/AppHeader';
import { Card, ProgressBar, SectionHeader } from '../components/ui';
import { MaterialIcon } from '../components/MaterialIcon';
import { useI18n } from '../i18n/i18n';
import { useApp } from '../store/AppState';
import { colors, gradients, radius, spacing, shadow } from '../theme/theme';

const { width } = Dimensions.get('window');

function greeting(t) {
  const h = new Date().getHours();
  if (h < 12) return t('greeting_morning');
  if (h < 18) return t('greeting_day');
  return t('greeting_evening');
}

function QuickAction({ icon, title, desc, colorsArr, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, styles.qaWrap]}>
      <LinearGradient colors={colorsArr} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.qa, shadow.soft]}>
        <View style={styles.qaIcon}>{icon}</View>
        <Text style={styles.qaTitle}>{title}</Text>
        <Text style={styles.qaDesc}>{desc}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function ActivityRow({ material, label, points, kg }) {
  return (
    <View style={styles.activityRow}>
      <MaterialIcon material={material} size={40} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={styles.activityLabel}>{label}</Text>
        <Text style={styles.activitySub}>{kg} кг</Text>
      </View>
      <Text style={styles.activityPoints}>+{points}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { t } = useI18n();
  const { stats, streak, passport, profile } = useApp();
  const firstName = profile?.name || 'друг';

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Верхний градиентный блок с эко-рейтингом */}
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
          <SafeAreaView edges={['top']}>
            <View style={styles.heroTop}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <LogoMark size={38} glow />
                <Text style={styles.brand}>Walley</Text>
              </View>
              <LangToggle />
            </View>

            <Text style={styles.greeting}>{greeting(t)}, {firstName} 👋</Text>
            <Text style={styles.tagline}>{t('app_tagline')}</Text>

            {/* Кольцо эко-рейтинга */}
            <View style={styles.scoreCard}>
              <View style={styles.scoreRing}>
                <Text style={styles.scoreValue}>{stats.ecoScore}</Text>
                <Text style={styles.scoreMax}>/100</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 18 }}>
                <Text style={styles.scoreTitle}>{t('home_eco_score')}</Text>
                <View style={styles.levelRow}>
                  <MaterialCommunityIcons name="shield-star" size={16} color={colors.sun} />
                  <Text style={styles.levelText}>
                    {t('home_level')} {stats.level}
                  </Text>
                  <View style={styles.streakPill}>
                    <MaterialCommunityIcons name="fire" size={13} color="#fff" />
                    <Text style={styles.streakText}>
                      {streak} {t('home_streak')}
                    </Text>
                  </View>
                </View>
                <View style={{ marginTop: 10 }}>
                  <ProgressBar value={stats.levelProgress} color={colors.mint300} track="rgba(255,255,255,0.22)" />
                  <Text style={styles.levelHint}>
                    {stats.xpNeed - stats.xpInto} XP {t('home_next_level')}
                  </Text>
                </View>
              </View>
            </View>

            {/* Мини-статистика */}
            <View style={styles.miniStats}>
              <MiniStat icon="cloud-outline" value={`${stats.co2} кг`} label={t('home_co2_saved')} />
              <View style={styles.divider} />
              <MiniStat icon="recycle" value={`${stats.totalKg} кг`} label={t('home_recycled')} />
              <View style={styles.divider} />
              <MiniStat icon="check-decagram" value={stats.recycled} label={t('passport_verified')} />
            </View>
          </SafeAreaView>
        </LinearGradient>

        {/* Быстрые действия */}
        <View style={styles.body}>
          <SectionHeader title={t('home_quick')} />
          <View style={styles.qaGrid}>
            <QuickAction
              icon={<MaterialCommunityIcons name="line-scan" size={26} color="#fff" />}
              title={t('home_scan')}
              desc={t('home_scan_desc')}
              colorsArr={gradients.mint}
              onPress={() => navigation.navigate('Scan')}
            />
            <QuickAction
              icon={<MaterialCommunityIcons name="robot-outline" size={26} color="#fff" />}
              title={t('home_call_robot')}
              desc={t('home_call_robot_desc')}
              colorsArr={gradients.water}
              onPress={() => navigation.navigate('Robot')}
            />
            <QuickAction
              icon={<Ionicons name="map" size={24} color="#fff" />}
              title={t('home_map')}
              desc={t('home_map_desc')}
              colorsArr={['#1E8E5A', '#14603F']}
              onPress={() => navigation.navigate('Map')}
            />
            <QuickAction
              icon={<MaterialCommunityIcons name="brain" size={26} color="#fff" />}
              title={t('home_quiz')}
              desc={t('home_quiz_desc')}
              colorsArr={gradients.sun}
              onPress={() => navigation.navigate('Quiz')}
            />
          </View>

          {/* Недавняя активность */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader
              title={t('home_activity')}
              actionLabel={t('see_all')}
              onAction={() => navigation.navigate('Passport')}
            />
            <Card padded={false} style={{ paddingHorizontal: spacing.lg, paddingVertical: spacing.sm }}>
              {passport.slice(0, 3).map((e, i) => (
                <View key={e.id}>
                  <ActivityRow material={e.material} label={e.label} kg={e.weightKg} points={120} />
                  {i < 2 ? <View style={styles.rowDivider} /> : null}
                </View>
              ))}
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function MiniStat({ icon, value, label }) {
  return (
    <View style={styles.miniStat}>
      <MaterialCommunityIcons name={icon} size={18} color={colors.mint300} />
      <Text style={styles.miniValue}>{value}</Text>
      <Text style={styles.miniLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  brand: { color: '#fff', fontSize: 22, fontWeight: '800', marginLeft: 8, letterSpacing: -0.4 },
  greeting: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 18 },
  tagline: { color: colors.mint300, fontSize: 14, fontWeight: '600', marginTop: 2 },
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.lg,
    padding: 16,
    marginTop: 20,
  },
  scoreRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 6,
    borderColor: colors.mint300,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreValue: { color: '#fff', fontSize: 30, fontWeight: '800' },
  scoreMax: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '700', marginBottom: -8 },
  scoreTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  levelText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.clay,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    marginLeft: 4,
  },
  streakText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  levelHint: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginTop: 5 },
  miniStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.lg,
    paddingVertical: 14,
    marginTop: 12,
  },
  miniStat: { flex: 1, alignItems: 'center', gap: 2 },
  miniValue: { color: '#fff', fontSize: 15, fontWeight: '800', marginTop: 2 },
  miniLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10.5, fontWeight: '600', textAlign: 'center' },
  divider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.2)' },
  body: { paddingHorizontal: 20, paddingTop: 24 },
  qaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  qaWrap: { width: (width - 40 - 12) / 2 },
  qa: { borderRadius: radius.lg, padding: 16, minHeight: 116, justifyContent: 'space-between' },
  qaIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  qaTitle: { color: '#fff', fontSize: 15.5, fontWeight: '800', marginTop: 10 },
  qaDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 12, fontWeight: '600', marginTop: 1 },
  activityRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  activityLabel: { fontSize: 15, fontWeight: '700', color: colors.text },
  activitySub: { fontSize: 12.5, fontWeight: '600', color: colors.textMuted, marginTop: 1 },
  activityPoints: { fontSize: 15, fontWeight: '800', color: colors.green600 },
  rowDivider: { height: 1, backgroundColor: colors.border },
});
