import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Image,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { GradientButton, GhostButton, Card, Badge, ProgressBar } from '../components/ui';
import { MaterialIcon, MATERIALS } from '../components/MaterialIcon';
import { LangToggle } from '../components/AppHeader';
import { useI18n } from '../i18n/i18n';
import { useApp } from '../store/AppState';
import { recognizeWaste } from '../services/gemini';
import { collectionPoints } from '../data/mock';
import { colors, gradients, radius, spacing, shadow, materialColor } from '../theme/theme';

export default function ScanScreen({ navigation }) {
  const { t, lang } = useI18n();
  const { addWaste } = useApp();
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  const analyze = async (base64, uri) => {
    setBusy(true);
    setError(null);
    setResult(null);
    setPreview(uri || null);
    try {
      const res = await recognizeWaste(base64, lang);
      setResult(res);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    } catch (e) {
      setError(e?.message || t('scan_error'));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setBusy(false);
    }
  };

  const capture = async () => {
    if (!cameraRef.current || busy) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
      if (!photo?.base64) throw new Error('Камера не вернула изображение (base64)');
      await analyze(photo.base64, photo.uri);
    } catch (e) {
      setError(e?.message || t('scan_error'));
      setBusy(false);
    }
  };

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      base64: true,
      quality: 0.5,
    });
    if (!res.canceled && res.assets?.[0]) {
      await analyze(res.assets[0].base64, res.assets[0].uri);
    }
  };

  const reset = () => {
    setResult(null);
    setPreview(null);
    setError(null);
    setAdded(false);
  };

  const handleAdd = () => {
    if (!result) return;
    addWaste({ material: result.material, label: result.label, weightKg: 0.3 });
    setAdded(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
  };

  // Экран запроса разрешения
  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: colors.black }} />;
  }
  if (!permission.granted) {
    return (
      <View style={styles.permWrap}>
        <MaterialCommunityIcons name="camera-outline" size={64} color={colors.green400} />
        <Text style={styles.permTitle}>{t('scan_no_permission')}</Text>
        <GradientButton title={t('scan_grant')} onPress={requestPermission} style={{ marginTop: 20, width: 240 }} />
      </View>
    );
  }

  // Экран результата
  if (result || busy || error) {
    const nearest = result
      ? collectionPoints.find((p) => p.accepts.includes(result.material)) || collectionPoints[0]
      : null;
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <SafeAreaView edges={['top']} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
            <View style={styles.resultHeader}>
              <Text style={styles.resultTitle}>{t('scan_result')}</Text>
              <Pressable onPress={reset} hitSlop={10}>
                <Ionicons name="close-circle" size={30} color={colors.textFaint} />
              </Pressable>
            </View>

            {preview ? <Image source={{ uri: preview }} style={styles.preview} /> : null}

            {busy ? (
              <Card style={{ alignItems: 'center', paddingVertical: 40 }}>
                <ActivityIndicator size="large" color={colors.green500} />
                <Text style={styles.analyzing}>{t('scan_analyzing')}</Text>
              </Card>
            ) : error ? (
              <Card style={{ alignItems: 'center', paddingVertical: 32 }}>
                <MaterialCommunityIcons name="alert-circle-outline" size={40} color={colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
                <GhostButton title={t('scan_retake')} onPress={reset} style={{ marginTop: 16, width: 200 }} />
              </Card>
            ) : (
              <>
                {/* Основная карточка результата */}
                <LinearGradient
                  colors={[materialColor(result.material), materialColor(result.material) + 'CC']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.resultCard, shadow.card]}
                >
                  <View style={styles.resultIconWrap}>
                    <MaterialCommunityIcons name={MATERIALS[result.material].icon} size={40} color="#fff" />
                  </View>
                  <Text style={styles.resultLabel}>{result.label}</Text>
                  <Text style={styles.resultMaterial}>{t(MATERIALS[result.material].tKey)}</Text>
                  <View style={styles.resultTags}>
                    <View style={styles.resultTag}>
                      <MaterialCommunityIcons
                        name={result.recyclable ? 'recycle' : 'close-octagon'}
                        size={15}
                        color="#fff"
                      />
                      <Text style={styles.resultTagText}>
                        {result.recyclable ? t('scan_recyclable') : t('scan_not_recyclable')}
                      </Text>
                    </View>
                    <View style={styles.resultTag}>
                      <Text style={styles.resultTagText}>
                        {t('scan_confidence')} {result.confidence}%
                      </Text>
                    </View>
                  </View>
                </LinearGradient>

                {/* Как подготовить */}
                {result.instructions ? (
                  <Card style={{ marginTop: 14 }}>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="lightbulb-on-outline" size={20} color={colors.sun} />
                      <Text style={styles.infoTitle}>{t('scan_how')}</Text>
                    </View>
                    <Text style={styles.infoText}>{result.instructions}</Text>
                    {result.bin ? (
                      <View style={{ marginTop: 10 }}>
                        <Badge label={`${t('scan_bin')}: ${result.bin}`} color={colors.green600} />
                      </View>
                    ) : null}
                  </Card>
                ) : null}

                {/* Эко-факт */}
                {result.tip ? (
                  <Card style={{ marginTop: 12, backgroundColor: colors.mint100 }}>
                    <View style={styles.infoRow}>
                      <MaterialCommunityIcons name="earth" size={20} color={colors.green600} />
                      <Text style={[styles.infoTitle, { color: colors.forest800 }]}>Эко-факт</Text>
                    </View>
                    <Text style={[styles.infoText, { color: colors.forest800 }]}>{result.tip}</Text>
                  </Card>
                ) : null}

                {/* Ближайший пункт */}
                {nearest ? (
                  <Card style={{ marginTop: 12 }}>
                    <Text style={styles.infoTitle}>{t('scan_nearest')}</Text>
                    <Pressable
                      style={styles.nearestRow}
                      onPress={() => navigation.navigate('Map')}
                    >
                      <View style={styles.nearestPin}>
                        <Ionicons name="location" size={18} color="#fff" />
                      </View>
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.nearestName}>{nearest.name}</Text>
                        <Text style={styles.nearestAddr}>{nearest.address}</Text>
                      </View>
                      <Text style={styles.nearestDist}>{nearest.distanceKm} {t('km_away')}</Text>
                    </Pressable>
                  </Card>
                ) : null}

                {/* Действия */}
                <View style={{ marginTop: 20, gap: 10 }}>
                  {added ? (
                    <View style={styles.addedBanner}>
                      <MaterialCommunityIcons name="check-decagram" size={20} color={colors.green600} />
                      <Text style={styles.addedText}>{t('scan_added')}</Text>
                    </View>
                  ) : (
                    <GradientButton
                      title={t('scan_add_passport')}
                      icon={<MaterialCommunityIcons name="card-account-details-outline" size={20} color="#fff" />}
                      onPress={handleAdd}
                    />
                  )}
                  <GhostButton
                    title={t('scan_retake')}
                    icon={<MaterialCommunityIcons name="camera-retake-outline" size={18} color={colors.forest800} />}
                    onPress={reset}
                  />
                </View>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  // Экран камеры
  return (
    <View style={{ flex: 1, backgroundColor: colors.black }}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="back" />

      <SafeAreaView edges={['top']} style={styles.camTop}>
        <View style={styles.camHeader}>
          <View>
            <Text style={styles.camTitle}>{t('scan_title')}</Text>
            <Text style={styles.camHint}>{t('scan_hint')}</Text>
          </View>
          <LangToggle />
        </View>
      </SafeAreaView>

      {/* Рамка наведения */}
      <View style={styles.frameWrap} pointerEvents="none">
        <View style={styles.frame}>
          <Corner style={{ top: -2, left: -2 }} r={{ borderTopLeftRadius: 24 }} b="tl" />
          <Corner style={{ top: -2, right: -2 }} b="tr" />
          <Corner style={{ bottom: -2, left: -2 }} b="bl" />
          <Corner style={{ bottom: -2, right: -2 }} b="br" />
        </View>
      </View>

      {/* Управление */}
      <SafeAreaView edges={['bottom']} style={styles.camBottom}>
        <View style={styles.controls}>
          <Pressable style={styles.sideBtn} onPress={pickImage}>
            <MaterialCommunityIcons name="image-outline" size={26} color="#fff" />
            <Text style={styles.sideBtnText}>{t('scan_gallery')}</Text>
          </Pressable>

          <Pressable onPress={capture} style={styles.shutterOuter}>
            <LinearGradient colors={gradients.mint} style={styles.shutterInner}>
              <MaterialCommunityIcons name="line-scan" size={30} color="#fff" />
            </LinearGradient>
          </Pressable>

          <View style={styles.sideBtn} />
        </View>
        <Text style={styles.captureLabel}>{t('scan_capture')}</Text>
      </SafeAreaView>
    </View>
  );
}

function Corner({ style, b }) {
  const map = {
    tl: { borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 24 },
    tr: { borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 24 },
    bl: { borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 24 },
    br: { borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 24 },
  };
  return <View style={[styles.corner, map[b], style]} />;
}

const styles = StyleSheet.create({
  permWrap: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center', padding: 40 },
  permTitle: { fontSize: 18, fontWeight: '800', color: colors.text, marginTop: 16, textAlign: 'center' },
  camTop: { position: 'absolute', top: 0, left: 0, right: 0 },
  camHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  camTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  camHint: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '600', marginTop: 2 },
  frameWrap: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
  frame: { width: 260, height: 260 },
  corner: { position: 'absolute', width: 44, height: 44, borderColor: colors.mint300 },
  camBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingBottom: 24 },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
  },
  sideBtn: { width: 64, alignItems: 'center', gap: 4 },
  sideBtnText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  shutterOuter: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: { width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center' },
  captureLabel: { color: '#fff', textAlign: 'center', fontWeight: '700', marginTop: 12, fontSize: 13 },
  // результат
  resultHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  resultTitle: { fontSize: 24, fontWeight: '800', color: colors.text },
  preview: { width: '100%', height: 180, borderRadius: radius.lg, marginBottom: 16 },
  analyzing: { marginTop: 14, fontSize: 15, fontWeight: '700', color: colors.textMuted },
  errorText: { marginTop: 12, fontSize: 15, fontWeight: '700', color: colors.text, textAlign: 'center' },
  resultCard: { borderRadius: radius.xl, padding: 24, alignItems: 'center' },
  resultIconWrap: {
    width: 76,
    height: 76,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultLabel: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 14, textAlign: 'center' },
  resultMaterial: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '700', marginTop: 2 },
  resultTags: { flexDirection: 'row', gap: 8, marginTop: 16, flexWrap: 'wrap', justifyContent: 'center' },
  resultTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  resultTagText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoTitle: { fontSize: 15, fontWeight: '800', color: colors.text },
  infoText: { fontSize: 14, fontWeight: '500', color: colors.textMuted, marginTop: 8, lineHeight: 20 },
  nearestRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  nearestPin: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: colors.green500, alignItems: 'center', justifyContent: 'center',
  },
  nearestName: { fontSize: 14.5, fontWeight: '800', color: colors.text },
  nearestAddr: { fontSize: 12.5, fontWeight: '600', color: colors.textMuted },
  nearestDist: { fontSize: 13, fontWeight: '800', color: colors.green600 },
  addedBanner: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.mint100, paddingVertical: 16, borderRadius: radius.pill,
  },
  addedText: { color: colors.forest800, fontWeight: '800', fontSize: 15 },
});
