import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { Card, GradientButton, Chip } from '../components/ui';
import { LogoMark } from '../components/Logo';
import { MATERIALS } from '../components/MaterialIcon';
import { useI18n } from '../i18n/i18n';
import { wasteTypeOptions } from '../data/mock';
import { colors, gradients, radius, spacing, shadow, materialColor } from '../theme/theme';

const WEIGHTS = ['< 1', '1–5', '5–10', '> 10'];

export default function RobotScreen() {
  const { t } = useI18n();
  const [address, setAddress] = useState('');
  const [types, setTypes] = useState(['plastic']);
  const [weight, setWeight] = useState('1–5');
  const [when, setWhen] = useState('now');
  const [called, setCalled] = useState(false);
  const [eta, setEta] = useState(9);

  const toggleType = (m) =>
    setTypes((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));

  useEffect(() => {
    if (!called) return;
    const id = setInterval(() => setEta((e) => (e > 1 ? e - 1 : e)), 4000);
    return () => clearInterval(id);
  }, [called]);

  const call = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setCalled(true);
  };

  if (called) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={['top']}>
          <View style={{ height: 8 }} />
          <AppHeader title={t('robot_title')} />
        </SafeAreaView>
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          <LinearGradient colors={gradients.water} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.trackCard, shadow.card]}>
            <View style={styles.pulse}>
              <LogoMark size={72} glow />
            </View>
            <Text style={styles.trackStatus}>{t('robot_status_way')}</Text>
            <View style={styles.etaRow}>
              <Text style={styles.etaValue}>{eta}</Text>
              <Text style={styles.etaUnit}>{t('robot_min')}</Text>
            </View>
            <Text style={styles.etaLabel}>{t('robot_eta')}</Text>

            {/* Прогресс движения робота */}
            <View style={styles.routeLine}>
              <View style={styles.routeDotDone} />
              <View style={styles.routeSegDone} />
              <View style={styles.routeDotActive}>
                <MaterialCommunityIcons name="robot" size={14} color="#fff" />
              </View>
              <View style={styles.routeSeg} />
              <View style={styles.routeDot}>
                <MaterialCommunityIcons name="home" size={13} color={colors.water} />
              </View>
            </View>
            <View style={styles.routeLabels}>
              <Text style={styles.routeText}>Станция</Text>
              <Text style={styles.routeText}>Вы</Text>
            </View>
          </LinearGradient>

          <Card style={{ marginTop: 16, backgroundColor: colors.mint100 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <MaterialCommunityIcons name="eye-outline" size={22} color={colors.green600} />
              <Text style={styles.reportText}>{t('robot_report')}</Text>
            </View>
          </Card>

          <Pressable style={styles.cancelBtn} onPress={() => setCalled(false)}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </Pressable>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']}>
        <View style={{ height: 8 }} />
        <AppHeader title={t('robot_title')} subtitle={t('robot_subtitle')} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {/* Иллюстрация робота */}
        <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.robotHero}>
          <LogoMark size={92} glow />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.robotHeroTitle}>Walley-Bot</Text>
            <Text style={styles.robotHeroDesc}>
              Распознаёт · взвешивает · присваивает ID · везёт на сортировку
            </Text>
          </View>
        </LinearGradient>

        {/* Адрес */}
        <Text style={styles.label}>{t('robot_address')}</Text>
        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="map-marker-outline" size={20} color={colors.textMuted} />
          <TextInput
            style={styles.input}
            placeholder={t('robot_address_ph')}
            placeholderTextColor={colors.textFaint}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Тип отходов */}
        <Text style={styles.label}>{t('robot_waste_type')}</Text>
        <View style={styles.chipRow}>
          {wasteTypeOptions.map((m) => (
            <Chip
              key={m}
              label={t(MATERIALS[m].tKey)}
              active={types.includes(m)}
              color={materialColor(m)}
              onPress={() => toggleType(m)}
              icon={
                <MaterialCommunityIcons
                  name={MATERIALS[m].icon}
                  size={15}
                  color={types.includes(m) ? '#fff' : materialColor(m)}
                />
              }
            />
          ))}
        </View>

        {/* Вес */}
        <Text style={styles.label}>{t('robot_weight')} ({t('kg')})</Text>
        <View style={styles.chipRow}>
          {WEIGHTS.map((w) => (
            <Chip key={w} label={w} active={weight === w} onPress={() => setWeight(w)} />
          ))}
        </View>

        {/* Когда */}
        <Text style={styles.label}>{t('robot_when')}</Text>
        <View style={styles.segment}>
          {[
            { k: 'now', label: t('robot_now'), icon: 'flash' },
            { k: 'schedule', label: t('robot_schedule'), icon: 'calendar-clock' },
          ].map((o) => (
            <Pressable
              key={o.k}
              style={[styles.segItem, when === o.k && styles.segItemActive]}
              onPress={() => setWhen(o.k)}
            >
              <MaterialCommunityIcons name={o.icon} size={18} color={when === o.k ? '#fff' : colors.textMuted} />
              <Text style={[styles.segText, when === o.k && { color: '#fff' }]}>{o.label}</Text>
            </Pressable>
          ))}
        </View>

        <GradientButton
          title={t('robot_call')}
          icon={<MaterialCommunityIcons name="robot-outline" size={20} color="#fff" />}
          colorsArr={gradients.water}
          onPress={call}
          style={{ marginTop: 28 }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  robotHero: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.xl,
    padding: 18,
    ...shadow.card,
  },
  robotHeroTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  robotHeroDesc: { color: colors.mint300, fontSize: 13, fontWeight: '600', marginTop: 4, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: '800', color: colors.text, marginTop: 22, marginBottom: 10 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 52,
    ...shadow.soft,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '600', color: colors.text },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  segment: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
    ...shadow.soft,
  },
  segItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: radius.sm,
  },
  segItemActive: { backgroundColor: colors.water },
  segText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
  // tracking
  trackCard: { borderRadius: radius.xl, padding: 28, alignItems: 'center' },
  pulse: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  trackStatus: { color: '#fff', fontSize: 18, fontWeight: '800', marginTop: 18 },
  etaRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginTop: 10 },
  etaValue: { color: '#fff', fontSize: 52, fontWeight: '800', lineHeight: 56 },
  etaUnit: { color: 'rgba(255,255,255,0.85)', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  etaLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '600' },
  routeLine: { flexDirection: 'row', alignItems: 'center', marginTop: 24, width: '100%' },
  routeDotDone: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#fff' },
  routeSegDone: { flex: 1, height: 3, backgroundColor: '#fff' },
  routeDotActive: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: colors.forest800,
    alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff',
  },
  routeSeg: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.4)' },
  routeDot: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  routeLabels: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 8 },
  routeText: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700' },
  reportText: { flex: 1, color: colors.forest800, fontSize: 13.5, fontWeight: '600', lineHeight: 19 },
  cancelBtn: { alignItems: 'center', paddingVertical: 18, marginTop: 8 },
  cancelText: { color: colors.danger, fontWeight: '800', fontSize: 15 },
});
