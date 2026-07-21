import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import {
  colors,
  gradients,
  radius,
  spacing,
  shadow,
  typography,
} from '../theme/theme';

export function Card({ children, style, padded = true }) {
  return (
    <View
      style={[
        styles.card,
        padded && { padding: spacing.lg },
        style,
      ]}
    >
      {children}
    </View>
  );
}

export function GradientButton({
  title,
  onPress,
  colorsArr = gradients.mint,
  icon,
  loading = false,
  disabled = false,
  style,
}) {
  const handle = () => {
    if (disabled || loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onPress && onPress();
  };
  return (
    <Pressable onPress={handle} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }, style]}>
      <LinearGradient
        colors={disabled ? [colors.border, colors.border] : colorsArr}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gButton, shadow.soft]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {icon}
            <Text style={styles.gButtonText}>{title}</Text>
          </View>
        )}
      </LinearGradient>
    </Pressable>
  );
}

export function GhostButton({ title, onPress, icon, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.ghost, pressed && { opacity: 0.7 }, style]}
    >
      {icon}
      <Text style={styles.ghostText}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, active, onPress, color = colors.green500, icon }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        active
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {icon}
      <Text
        style={[
          styles.chipText,
          { color: active ? colors.white : colors.textMuted },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ value = 0, color = colors.green500, track = colors.surfaceAlt, height = 10 }) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <View style={[styles.track, { height, backgroundColor: track }]}>
      <View style={{ width: `${pct}%`, height: '100%' }}>
        <LinearGradient
          colors={[color, colors.mint300]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 999 }}
        />
      </View>
    </View>
  );
}

export function SectionHeader({ title, actionLabel, onAction }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {actionLabel ? (
        <Pressable onPress={onAction}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function Badge({ label, color = colors.green500, bg }) {
  return (
    <View style={[styles.badge, { backgroundColor: bg || color + '22' }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function StatTile({ value, label, color = colors.green500, icon }) {
  return (
    <View style={styles.statTile}>
      {icon}
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadow.soft,
  },
  gButton: {
    height: 54,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  gButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '800',
  },
  ghost: {
    height: 50,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  ghostText: { color: colors.forest800, fontWeight: '700', fontSize: 15 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  chipText: { fontWeight: '700', fontSize: 13.5 },
  track: { borderRadius: 999, overflow: 'hidden', width: '100%' },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitle: { ...typography.h2, color: colors.text },
  sectionAction: { color: colors.green600, fontWeight: '700', fontSize: 14 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 12, fontWeight: '800' },
  statTile: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
    paddingVertical: spacing.md,
  },
  statValue: { fontSize: 20, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600', color: colors.textMuted, textAlign: 'center' },
});

export default { Card, GradientButton, GhostButton, Chip, ProgressBar, SectionHeader, Badge, StatTile };
