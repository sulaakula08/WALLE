import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { HAS_MAPS_KEY } from '../config';
import { gradients } from '../theme/theme';
import { AppHeader } from '../components/AppHeader';
import { Card, Chip, Badge } from '../components/ui';
import { MaterialIcon, MATERIALS } from '../components/MaterialIcon';
import { useI18n } from '../i18n/i18n';
import { collectionPoints } from '../data/mock';
import { colors, radius, spacing, shadow, materialColor } from '../theme/theme';

// react-native-maps доступен в Expo Go на Android; при отсутствии модуля
// показываем стилизованную заглушку, а список пунктов работает всегда.
let MapView, Marker, PROVIDER_GOOGLE;
try {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
  PROVIDER_GOOGLE = maps.PROVIDER_GOOGLE;
} catch (e) {
  MapView = null;
}

const FILTERS = ['all', 'plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste'];

export default function MapScreen({ navigation }) {
  const { t } = useI18n();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(collectionPoints[0].id);

  const points = useMemo(
    () =>
      filter === 'all'
        ? collectionPoints
        : collectionPoints.filter((p) => p.accepts.includes(filter)),
    [filter]
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']}>
        <View style={{ height: 8 }} />
        <AppHeader title={t('map_title')} subtitle={t('map_subtitle')} />
      </SafeAreaView>

      {/* Карта */}
      <View style={styles.mapWrap}>
        {MapView && HAS_MAPS_KEY ? (
          <MapView
            style={StyleSheet.absoluteFill}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={{
              latitude: 51.13,
              longitude: 71.44,
              latitudeDelta: 0.12,
              longitudeDelta: 0.12,
            }}
          >
            {points.map((p) => (
              <Marker
                key={p.id}
                coordinate={{ latitude: p.lat, longitude: p.lng }}
                title={p.name}
                description={p.address}
                pinColor={p.open ? colors.green500 : colors.metal}
                onPress={() => setSelected(p.id)}
              />
            ))}
          </MapView>
        ) : (
          <LinearGradient colors={gradients.brand} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.mapFallback}>
            {/* декоративные «пины» на карте */}
            {points.slice(0, 5).map((p, i) => (
              <View
                key={p.id}
                style={[
                  styles.ghostPin,
                  {
                    top: 30 + ((i * 37) % 120),
                    left: 40 + ((i * 61) % 240),
                    opacity: p.open ? 1 : 0.5,
                  },
                ]}
              >
                <Ionicons name="location" size={18} color="#fff" />
              </View>
            ))}
            <View style={styles.mapFallbackCenter}>
              <MaterialCommunityIcons name="map-marker-radius" size={40} color="#fff" />
              <Text style={styles.mapFallbackText}>{points.length} пунктов рядом</Text>
              <Text style={styles.mapFallbackHint}>Карта появится после добавления ключа Google Maps</Text>
            </View>
          </LinearGradient>
        )}
      </View>

      {/* Фильтры по материалам */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
      >
        {FILTERS.map((f) => (
          <Chip
            key={f}
            label={f === 'all' ? t('map_filter_all') : t(MATERIALS[f].tKey)}
            active={filter === f}
            color={f === 'all' ? colors.green500 : materialColor(f)}
            onPress={() => setFilter(f)}
          />
        ))}
      </ScrollView>

      {/* Список пунктов */}
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 12 }}
      >
        {points.map((p) => (
          <Pressable key={p.id} onPress={() => setSelected(p.id)}>
            <Card
              style={[
                styles.pointCard,
                selected === p.id && { borderColor: colors.green400, borderWidth: 2 },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.pin}>
                  <Ionicons name="location" size={22} color={colors.white} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.pointName}>{p.name}</Text>
                  <Text style={styles.pointAddr}>{p.address}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <Badge
                      label={p.open ? t('map_open_now') : t('map_closed')}
                      color={p.open ? colors.green600 : colors.danger}
                    />
                    <Text style={styles.hours}>{p.hours}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={styles.distance}>{p.distanceKm}</Text>
                  <Text style={styles.distanceUnit}>{t('km_away')}</Text>
                </View>
              </View>

              <Text style={styles.acceptsLabel}>{t('map_accepts')}:</Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                {p.accepts.map((m) => (
                  <View key={m} style={styles.acceptChip}>
                    <MaterialIcon material={m} size={26} />
                    <Text style={styles.acceptText}>{t(MATERIALS[m].tKey)}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mapWrap: {
    height: 200,
    marginHorizontal: 20,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    ...shadow.soft,
  },
  mapFallback: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  mapFallbackCenter: { alignItems: 'center', gap: 4, paddingHorizontal: 24 },
  mapFallbackText: { color: '#fff', fontWeight: '800', fontSize: 16, marginTop: 4 },
  mapFallbackHint: { color: 'rgba(255,255,255,0.75)', fontWeight: '600', fontSize: 11.5, textAlign: 'center' },
  ghostPin: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: { flexGrow: 0, paddingVertical: 14 },
  pointCard: { padding: spacing.lg },
  pin: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.green500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointName: { fontSize: 16, fontWeight: '800', color: colors.text },
  pointAddr: { fontSize: 13, fontWeight: '600', color: colors.textMuted, marginTop: 1 },
  hours: { fontSize: 12, fontWeight: '600', color: colors.textFaint },
  distance: { fontSize: 20, fontWeight: '800', color: colors.green600 },
  distanceUnit: { fontSize: 11, fontWeight: '700', color: colors.textFaint, marginTop: -2 },
  acceptsLabel: { fontSize: 12.5, fontWeight: '700', color: colors.textMuted, marginTop: 14 },
  acceptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    paddingRight: 10,
    paddingLeft: 4,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  acceptText: { fontSize: 12, fontWeight: '700', color: colors.text },
});
