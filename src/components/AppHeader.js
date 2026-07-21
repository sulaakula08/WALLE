import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LogoMark } from './Logo';
import { useI18n } from '../i18n/i18n';
import { colors, radius, shadow } from '../theme/theme';

// Компактный переключатель языка RU / KZ
export function LangToggle() {
  const { lang, changeLang } = useI18n();
  return (
    <View style={styles.toggle}>
      {['ru', 'kz'].map((l) => (
        <Pressable
          key={l}
          onPress={() => changeLang(l)}
          style={[styles.segment, lang === l && styles.segmentActive]}
        >
          <Text style={[styles.segmentText, lang === l && styles.segmentTextActive]}>
            {l === 'ru' ? 'RU' : 'ҚАЗ'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

// Заголовок с брендом слева и переключателем языка справа
export function AppHeader({ title, subtitle, showLogo = false, right }) {
  return (
    <View style={styles.header}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
        {showLogo ? <LogoMark size={40} /> : null}
        <View style={{ marginLeft: showLogo ? 10 : 0 }}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {right !== undefined ? right : <LangToggle />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, letterSpacing: -0.3 },
  subtitle: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginTop: 2 },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    padding: 3,
    ...shadow.soft,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  segmentActive: { backgroundColor: colors.green500 },
  segmentText: { fontSize: 12.5, fontWeight: '800', color: colors.textMuted },
  segmentTextActive: { color: colors.white },
});

export default AppHeader;
