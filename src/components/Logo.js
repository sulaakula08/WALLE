import React from 'react';
import { View, Text } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  Stop,
  Rect,
  Path,
  Circle,
  G,
  Ellipse,
} from 'react-native-svg';
import { colors } from '../theme/theme';

/**
 * LogoMark — фирменный знак Walley.
 * Робот-эколог: голова со скруглённым корпусом, глаза-датчики,
 * над головой прорастает лист (символ природы), вокруг — виток
 * стрелки переработки. Нарисовано вручную в виде путей.
 */
export function LogoMark({ size = 64, glow = false }) {
  const s = size;
  return (
    <Svg width={s} height={s} viewBox="0 0 120 120" fill="none">
      <Defs>
        <LinearGradient id="body" x1="20" y1="24" x2="100" y2="108">
          <Stop offset="0" stopColor="#1E8E5A" />
          <Stop offset="1" stopColor="#0F4D3A" />
        </LinearGradient>
        <LinearGradient id="leaf" x1="52" y1="6" x2="86" y2="40">
          <Stop offset="0" stopColor="#7EE2B0" />
          <Stop offset="1" stopColor="#27AE60" />
        </LinearGradient>
        <LinearGradient id="arrow" x1="10" y1="60" x2="110" y2="60">
          <Stop offset="0" stopColor="#4CD08A" />
          <Stop offset="1" stopColor="#2CC5C0" />
        </LinearGradient>
      </Defs>

      {/* Виток стрелки переработки вокруг головы */}
      <Path
        d="M18 74 A44 44 0 1 1 40 100"
        stroke="url(#arrow)"
        strokeWidth="7"
        strokeLinecap="round"
        opacity={glow ? 0.9 : 0.55}
        fill="none"
      />
      <Path d="M40 100 l-9 -4 l3 11 z" fill={colors.water} opacity={glow ? 0.9 : 0.55} />

      {/* Стебель листа-антенны */}
      <Path d="M60 30 C60 20 62 14 68 8" stroke="#27AE60" strokeWidth="5" strokeLinecap="round" />
      {/* Лист */}
      <Path
        d="M68 8 C82 8 90 18 86 32 C74 34 64 24 68 8 Z"
        fill="url(#leaf)"
      />
      <Path d="M72 14 C76 20 80 24 84 26" stroke="#0F4D3A" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

      {/* Корпус головы робота */}
      <Rect x="26" y="34" width="68" height="60" rx="20" fill="url(#body)" />
      {/* Панель-визор */}
      <Rect x="34" y="44" width="52" height="34" rx="15" fill="#0B3D2E" />

      {/* Глаза-датчики */}
      <Circle cx="52" cy="61" r="7.5" fill="#7EE2B0" />
      <Circle cx="52" cy="61" r="3.2" fill="#0B3D2E" />
      <Circle cx="74" cy="61" r="7.5" fill="#7EE2B0" />
      <Circle cx="74" cy="61" r="3.2" fill="#0B3D2E" />
      {/* Блик-улыбка */}
      <Path d="M54 72 Q60 76 66 72" stroke="#4CD08A" strokeWidth="3" strokeLinecap="round" fill="none" />

      {/* Боковые «уши»-сенсоры */}
      <Rect x="20" y="54" width="8" height="20" rx="4" fill="#14603F" />
      <Rect x="92" y="54" width="8" height="20" rx="4" fill="#14603F" />

      {/* Опора / низ корпуса */}
      <Ellipse cx="60" cy="98" rx="20" ry="5" fill="#0B3D2E" opacity="0.18" />
    </Svg>
  );
}

/** Небольшой значок листа для декора */
export function LeafIcon({ size = 20, color = colors.green500 }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 4 C11 4 4 9 4 18 C4 19 5 20 6 20 C15 20 20 13 20 4 Z"
        fill={color}
      />
      <Path d="M7 17 C10 13 13 10 17 8" stroke="#0B3D2E" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    </Svg>
  );
}

/** Логотип с текстовой частью Walley */
export function LogoFull({ size = 40, dark = false, tagline }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <LogoMark size={size} glow={dark} />
      <View style={{ marginLeft: 10 }}>
        <Text
          style={{
            fontSize: size * 0.62,
            fontWeight: '800',
            letterSpacing: -0.5,
            color: dark ? colors.white : colors.forest800,
          }}
        >
          Walley
        </Text>
        {tagline ? (
          <Text
            style={{
              fontSize: size * 0.26,
              fontWeight: '700',
              letterSpacing: 0.3,
              marginTop: -2,
              color: dark ? colors.mint300 : colors.green600,
            }}
          >
            {tagline}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

export default LogoMark;
