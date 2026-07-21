import React, { useRef, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { GLView } from 'expo-gl';
import { Renderer } from 'expo-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { LogoMark } from './Logo';
import { colors } from '../theme/theme';

// base64 -> ArrayBuffer без внешних зависимостей (для парсинга .glb)
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function base64ToArrayBuffer(base64) {
  const lookup = new Uint8Array(256);
  for (let i = 0; i < B64.length; i++) lookup[B64.charCodeAt(i)] = i;
  let len = base64.length * 0.75;
  if (base64[base64.length - 1] === '=') {
    len--;
    if (base64[base64.length - 2] === '=') len--;
  }
  const bytes = new Uint8Array(len);
  let p = 0;
  for (let i = 0; i < base64.length; i += 4) {
    const e1 = lookup[base64.charCodeAt(i)];
    const e2 = lookup[base64.charCodeAt(i + 1)];
    const e3 = lookup[base64.charCodeAt(i + 2)];
    const e4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = (e1 << 2) | (e2 >> 4);
    if (base64.charCodeAt(i + 2) !== 61) bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2);
    if (base64.charCodeAt(i + 3) !== 61) bytes[p++] = ((e3 & 3) << 6) | e4;
  }
  return bytes.buffer;
}

/**
 * Mascot3D — рендер GLB-маскота на прозрачном фоне.
 * Модель без анимаций, поэтому «оживляем» вращением и покачиванием.
 * Если загрузка не удалась — показываем 2D-логотип как запасной вариант.
 */
export default function Mascot3D({ style, autoRotate = true }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const pivotRef = useRef(null);
  const frameRef = useRef(null);

  const onContextCreate = async (gl) => {
    const w = gl.drawingBufferWidth;
    const h = gl.drawingBufferHeight;

    const renderer = new Renderer({ gl });
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0); // прозрачный фон

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
    camera.position.set(0, 0.2, 4.2);

    scene.add(new THREE.AmbientLight(0xffffff, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 1.7);
    key.position.set(3, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7ee2b0, 0.9);
    rim.position.set(-3, 2, -4);
    scene.add(rim);

    try {
      const asset = Asset.fromModule(require('../../assets/Wallekhan.glb'));
      await asset.downloadAsync();
      const uri = asset.localUri || asset.uri;
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const arrayBuffer = base64ToArrayBuffer(base64);

      const loader = new GLTFLoader();
      loader.parse(
        arrayBuffer,
        '',
        (gltf) => {
          const model = gltf.scene;
          // центрируем и масштабируем под кадр
          const box = new THREE.Box3().setFromObject(model);
          const size = new THREE.Vector3();
          const center = new THREE.Vector3();
          box.getSize(size);
          box.getCenter(center);
          model.position.sub(center);

          const pivot = new THREE.Group();
          pivot.add(model);
          const maxDim = Math.max(size.x, size.y, size.z) || 1;
          pivot.scale.setScalar(2.4 / maxDim);
          scene.add(pivot);
          pivotRef.current = pivot;
          setLoading(false);
        },
        () => {
          setFailed(true);
          setLoading(false);
        }
      );
    } catch (e) {
      setFailed(true);
      setLoading(false);
    }

    const clock = new THREE.Clock();
    const render = () => {
      frameRef.current = requestAnimationFrame(render);
      const t = clock.getElapsedTime();
      if (pivotRef.current) {
        if (autoRotate) pivotRef.current.rotation.y += 0.012;
        pivotRef.current.position.y = Math.sin(t * 1.6) * 0.08; // лёгкое покачивание
      }
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };
    render();
  };

  React.useEffect(
    () => () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    },
    []
  );

  if (failed) {
    return (
      <View style={[styles.wrap, style, { alignItems: 'center', justifyContent: 'center' }]}>
        <LogoMark size={90} glow />
      </View>
    );
  }

  return (
    <View style={[styles.wrap, style]}>
      <GLView style={StyleSheet.absoluteFill} onContextCreate={onContextCreate} />
      {loading ? (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator color={colors.mint300} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', height: '100%' },
  loader: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center' },
});
