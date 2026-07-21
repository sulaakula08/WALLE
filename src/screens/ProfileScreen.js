import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader, LangToggle } from '../components/AppHeader';
import { Card, ProgressBar, SectionHeader } from '../components/ui';
import { useI18n } from '../i18n/i18n';
import { useApp } from '../store/AppState';
import { clans, badges } from '../data/mock';
import { colors, gradients, radius, spacing, shadow } from '../theme/theme';

const MY_CLAN_ID = 'c1';

export default function ProfileScreen() {
  const { t, lang, changeLang } = useI18n();
  const { stats, xp, profile } = useApp();
  const myClan = clans.find((c) => c.id === MY_CLAN_ID);
  const myRank = clans.findIndex((c) => c.id === MY_CLAN_ID) + 1;
  const displayName = profile?.name || 'Гость';
  const handle = '@' + (profile?.name || 'guest').toLowerCase().replace(/\s+/g, '');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Шапка профиля */}
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <SafeAreaView edges={['top']}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>{t('profile_title')}</Text>
              <LangToggle />
            </View>

            <View style={styles.profileRow}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{displayName.charAt(0).toUpperCase()}</Text>
                <View style={styles.levelBadge}>
                  <Text style={styles.levelBadgeText}>{stats.level}</Text>
                </View>
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.name}>{displayName}</Text>
                <Text style={styles.handle}>{handle} · {myClan.emoji} {myClan.name}</Text>
                <View style={{ marginTop: 10 }}>
                  <View style={styles.xpRow}>
                    <Text style={styles.xpText}>{xp} XP</Text>
                    <Text style={styles.xpNext}>{stats.xpNeed - stats.xpInto} → {t('profile_level')} {stats.level + 1}</Text>
                  </View>
                  <ProgressBar value={stats.levelProgress} color={colors.mint300} track="rgba(255,255,255,0.22)" />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          {/* Статистика */}
          <View style={styles.statGrid}>
            <StatBox icon="recycle" value={`${stats.totalKg}`} label={`${t('home_recycled')}, ${t('kg')}`} color={colors.green500} />
            <StatBox icon="cloud-outline" value={`${stats.co2}`} label="CO₂ кг" color={colors.sky} />
            <StatBox icon="star-four-points" value={stats.ecoScore} label={t('home_eco_score')} color={colors.sun} />
          </View>

          {/* Достижения */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title={t('profile_badges')} />
            <View style={styles.badgeGrid}>
              {badges.map((b) => (
                <View key={b.id} style={styles.badgeItem}>
                  <View
                    style={[
                      styles.badgeCircle,
                      { backgroundColor: b.earned ? b.color + '22' : colors.surfaceAlt },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={b.icon}
                      size={26}
                      color={b.earned ? b.color : colors.textFaint}
                    />
                    {!b.earned ? (
                      <View style={styles.lockOverlay}>
                        <MaterialCommunityIcons name="lock" size={12} color={colors.textFaint} />
                      </View>
                    ) : null}
                  </View>
                  <Text style={[styles.badgeName, !b.earned && { color: colors.textFaint }]}>{b.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Мой клан */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title={t('profile_clan')} />
            <LinearGradient colors={gradients.mint} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.clanCard, shadow.card]}>
              <Text style={styles.clanEmoji}>{myClan.emoji}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.clanName}>{myClan.name}</Text>
                <Text style={styles.clanMeta}>
                  {myClan.members} {t('profile_members')} · {myClan.city}
                </Text>
              </View>
              <View style={styles.rankPill}>
                <MaterialCommunityIcons name="trophy" size={15} color={colors.forest800} />
                <Text style={styles.rankText}>#{myRank}</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Рейтинг кланов */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title={t('profile_leaderboard')} />
            <Card padded={false} style={{ paddingVertical: 6, paddingHorizontal: 6 }}>
              {clans.map((c, i) => {
                const mine = c.id === MY_CLAN_ID;
                return (
                  <View key={c.id} style={[styles.leaderRow, mine && styles.leaderRowMine]}>
                    <Text style={[styles.leaderRank, i < 3 && { color: colors.sun }]}>{i + 1}</Text>
                    <Text style={styles.leaderEmoji}>{c.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.leaderName, mine && { color: colors.forest800 }]}>{c.name}</Text>
                      <Text style={styles.leaderCity}>{c.city} · {c.members} {t('profile_members')}</Text>
                    </View>
                    <Text style={styles.leaderPoints}>{(c.points / 1000).toFixed(0)}k</Text>
                  </View>
                );
              })}
            </Card>
          </View>

          {/* Настройки языка */}
          <View style={{ marginTop: spacing.xl }}>
            <SectionHeader title={t('profile_language')} />
            <Card>
              <View style={styles.langRow}>
                {[
                  { k: 'ru', label: 'Русский', flag: '🇷🇺' },
                  { k: 'kz', label: 'Қазақша', flag: '🇰🇿' },
                ].map((l) => (
                  <Pressable
                    key={l.k}
                    style={[styles.langOption, lang === l.k && styles.langOptionActive]}
                    onPress={() => changeLang(l.k)}
                  >
                    <Text style={styles.langFlag}>{l.flag}</Text>
                    <Text style={[styles.langLabel, lang === l.k && { color: colors.white }]}>{l.label}</Text>
                    {lang === l.k ? <MaterialCommunityIcons name="check-circle" size={18} color="#fff" /> : null}
                  </Pressable>
                ))}
              </View>
            </Card>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatBox({ icon, value, label, color }) {
  return (
    <Card style={styles.statBox}>
      <MaterialCommunityIcons name={icon} size={22} color={color} />
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  avatar: {
    width: 72, height: 72, borderRadius: 24, backgroundColor: colors.mint300,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: colors.forest800 },
  levelBadge: {
    position: 'absolute', bottom: -6, right: -6,
    backgroundColor: colors.sun, minWidth: 26, height: 26, borderRadius: 13,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.forest800,
    paddingHorizontal: 4,
  },
  levelBadgeText: { fontSize: 12, fontWeight: '800', color: colors.forest800 },
  name: { color: '#fff', fontSize: 22, fontWeight: '800' },
  handle: { color: colors.mint300, fontSize: 13, fontWeight: '600', marginTop: 2 },
  xpRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  xpText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  xpNext: { color: 'rgba(255,255,255,0.75)', fontSize: 12, fontWeight: '600' },
  statGrid: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, alignItems: 'center', paddingVertical: 18, gap: 4 },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 11, fontWeight: '600', color: colors.textMuted, textAlign: 'center' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeItem: { width: '30%', alignItems: 'center' },
  badgeCircle: {
    width: 62, height: 62, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
  },
  lockOverlay: {
    position: 'absolute', bottom: 4, right: 4,
    backgroundColor: colors.surface, borderRadius: 8, padding: 2,
  },
  badgeName: { fontSize: 11.5, fontWeight: '700', color: colors.text, textAlign: 'center', marginTop: 8 },
  clanCard: { flexDirection: 'row', alignItems: 'center', borderRadius: radius.lg, padding: 18 },
  clanEmoji: { fontSize: 36 },
  clanName: { color: '#fff', fontSize: 18, fontWeight: '800' },
  clanMeta: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginTop: 2 },
  rankPill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
  },
  rankText: { fontSize: 15, fontWeight: '800', color: colors.forest800 },
  leaderRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: 12, borderRadius: radius.md },
  leaderRowMine: { backgroundColor: colors.mint100 },
  leaderRank: { width: 22, textAlign: 'center', fontSize: 15, fontWeight: '800', color: colors.textMuted },
  leaderEmoji: { fontSize: 24 },
  leaderName: { fontSize: 15, fontWeight: '700', color: colors.text },
  leaderCity: { fontSize: 12, fontWeight: '600', color: colors.textMuted, marginTop: 1 },
  leaderPoints: { fontSize: 15, fontWeight: '800', color: colors.green600 },
  langRow: { flexDirection: 'row', gap: 12 },
  langOption: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingVertical: 14, paddingHorizontal: 14, borderRadius: radius.md,
    borderWidth: 2, borderColor: colors.border,
  },
  langOptionActive: { backgroundColor: colors.green500, borderColor: colors.green500 },
  langFlag: { fontSize: 20 },
  langLabel: { flex: 1, fontSize: 14, fontWeight: '700', color: colors.text },
});
