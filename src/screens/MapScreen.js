import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AppHeader } from '../components/AppHeader';
import { Card, Chip, Badge } from '../components/ui';
import { MaterialIcon, MATERIALS } from '../components/MaterialIcon';
import { useI18n } from '../i18n/i18n';
import { collectionPoints } from '../data/mock';
import { colors, radius, spacing, shadow, materialColor } from '../theme/theme';

const FILTERS = ['all', 'plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste'];

// Центр Астаны
const ASTANA = { lat: 51.13, lng: 71.43, zoom: 12 };

// HTML с картой Leaflet + тайлы OpenStreetMap (без API-ключа)
function buildMapHtml(points, selectedId) {
  const markers = JSON.stringify(
    points.map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      name: p.name,
      address: p.address,
      open: p.open,
    }))
  );
  return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
  html, body, #map { height: 100%; margin: 0; padding: 0; background: #eaf3ec; }
  .pin { width: 26px; height: 26px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg);
         border: 2.5px solid #fff; box-shadow: 0 2px 6px rgba(0,0,0,0.3); }
  .pin.sel { width: 32px; height: 32px; }
  .leaflet-popup-content { font-family: -apple-system, Roboto, sans-serif; font-size: 13px; }
</style>
</head>
<body>
<div id="map"></div>
<script>
  var map = L.map('map', { zoomControl: false, attributionControl: false })
    .setView([${ASTANA.lat}, ${ASTANA.lng}], ${ASTANA.zoom});
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
  var pts = ${markers};
  var sel = ${selectedId ? `'${selectedId}'` : 'null'};
  var bounds = [];
  pts.forEach(function (p) {
    var color = p.open ? '#27AE60' : '#9AA5B1';
    var isSel = p.id === sel;
    var icon = L.divIcon({
      className: '',
      html: '<div class="pin ' + (isSel ? 'sel' : '') + '" style="background:' + color + '"></div>',
      iconSize: [26, 26], iconAnchor: [13, 26], popupAnchor: [0, -24]
    });
    var m = L.marker([p.lat, p.lng], { icon: icon }).addTo(map);
    m.bindPopup('<b>' + p.name + '</b><br>' + p.address);
    if (isSel) m.openPopup();
    bounds.push([p.lat, p.lng]);
  });
  if (bounds.length > 1) { map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 }); }
</script>
</body>
</html>`;
}

export default function MapScreen() {
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

  const html = useMemo(() => buildMapHtml(points, selected), [points, selected]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <SafeAreaView edges={['top']}>
        <View style={{ height: 8 }} />
        <AppHeader title={t('map_title')} subtitle={t('map_subtitle')} />
      </SafeAreaView>

      {/* Карта OpenStreetMap (без ключа) */}
      <View style={styles.mapWrap}>
        <WebView
          key={filter}
          originWhitelist={['*']}
          source={{ html }}
          style={{ flex: 1, backgroundColor: colors.surfaceAlt }}
          scrollEnabled={false}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
        />
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
    height: 220,
    marginHorizontal: 20,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceAlt,
    ...shadow.soft,
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
