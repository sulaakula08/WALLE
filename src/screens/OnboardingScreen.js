import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LogoMark } from '../components/Logo';
import { LangToggle } from '../components/AppHeader';
import { GradientButton } from '../components/ui';
import { useI18n } from '../i18n/i18n';
import { useApp } from '../store/AppState';
import { colors, gradients, radius, spacing } from '../theme/theme';

const CITIES = ['Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе'];

const GENDERS = [
  { key: 'male', icon: 'gender-male', tKey: 'gender_male' },
  { key: 'female', icon: 'gender-female', tKey: 'gender_female' },
  { key: 'other', icon: 'account-outline', tKey: 'gender_other' },
];

export default function OnboardingScreen() {
  const { t } = useI18n();
  const { saveProfile } = useApp();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('male');
  const [city, setCity] = useState('Астана');
  const [error, setError] = useState(false);

  const submit = () => {
    if (!name.trim()) {
      setError(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    saveProfile({ name: name.trim(), gender, city });
  };

  return (
    <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, padding: 24 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={{ alignItems: 'flex-end' }}>
              <LangToggle />
            </View>

            {/* Шапка */}
            <View style={{ alignItems: 'center', marginTop: 12 }}>
              <LogoMark size={92} glow />
              <Text style={styles.welcome}>{t('onb_welcome')}</Text>
              <Text style={styles.subtitle}>{t('onb_subtitle')}</Text>
            </View>

            {/* Карточка формы */}
            <View style={styles.card}>
              {/* Имя */}
              <Text style={styles.label}>{t('onb_name')}</Text>
              <View style={[styles.inputWrap, error && { borderColor: colors.danger }]}>
                <MaterialCommunityIcons name="account-outline" size={20} color={colors.textMuted} />
                <TextInput
                  style={styles.input}
                  placeholder={t('onb_name_ph')}
                  placeholderTextColor={colors.textFaint}
                  value={name}
                  onChangeText={(v) => {
                    setName(v);
                    if (error) setError(false);
                  }}
                  returnKeyType="done"
                  maxLength={24}
                />
              </View>
              {error ? <Text style={styles.errText}>{t('onb_name_required')}</Text> : null}

              {/* Пол */}
              <Text style={styles.label}>{t('onb_gender')}</Text>
              <View style={styles.genderRow}>
                {GENDERS.map((g) => {
                  const active = gender === g.key;
                  return (
                    <Pressable
                      key={g.key}
                      style={[styles.genderItem, active && styles.genderItemActive]}
                      onPress={() => setGender(g.key)}
                    >
                      <MaterialCommunityIcons
                        name={g.icon}
                        size={24}
                        color={active ? colors.white : colors.textMuted}
                      />
                      <Text style={[styles.genderText, active && { color: colors.white }]}>
                        {t(g.tKey)}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Город */}
              <Text style={styles.label}>{t('onb_city')}</Text>
              <View style={styles.cityWrap}>
                {CITIES.map((c) => {
                  const active = city === c;
                  return (
                    <Pressable
                      key={c}
                      style={[styles.cityChip, active && styles.cityChipActive]}
                      onPress={() => setCity(c)}
                    >
                      {active ? (
                        <MaterialCommunityIcons name="map-marker" size={14} color={colors.white} />
                      ) : null}
                      <Text style={[styles.cityText, active && { color: colors.white }]}>{c}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ flex: 1 }} />

            <GradientButton
              title={t('onb_start')}
              icon={<MaterialCommunityIcons name="arrow-right" size={20} color="#fff" />}
              onPress={submit}
              style={{ marginTop: 24 }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  welcome: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 18, textAlign: 'center' },
  subtitle: { color: colors.mint300, fontSize: 14, fontWeight: '600', marginTop: 4 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: 22,
    marginTop: 28,
  },
  label: { fontSize: 14, fontWeight: '800', color: colors.text, marginBottom: 10, marginTop: 18 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 54,
    borderWidth: 2,
    borderColor: colors.border,
  },
  input: { flex: 1, fontSize: 16, fontWeight: '600', color: colors.text },
  errText: { color: colors.danger, fontSize: 12.5, fontWeight: '600', marginTop: 6 },
  genderRow: { flexDirection: 'row', gap: 10 },
  genderItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 16,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  genderItemActive: { backgroundColor: colors.green500, borderColor: colors.green500 },
  genderText: { fontSize: 13, fontWeight: '700', color: colors.textMuted },
  cityWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  cityChipActive: { backgroundColor: colors.green500, borderColor: colors.green500 },
  cityText: { fontSize: 14, fontWeight: '700', color: colors.textMuted },
});
