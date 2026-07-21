import React from 'react';
import { View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, materialColor } from '../theme/theme';

// Соответствие типа материала иконке и цвету (единая легенда)
export const MATERIALS = {
  plastic: { icon: 'bottle-soda-classic-outline', color: colors.plastic, tKey: 'mat_plastic' },
  paper: { icon: 'newspaper-variant-outline', color: colors.paper, tKey: 'mat_paper' },
  glass: { icon: 'bottle-wine-outline', color: colors.glass, tKey: 'mat_glass' },
  metal: { icon: 'silverware-fork-knife', color: colors.metal, tKey: 'mat_metal' },
  organic: { icon: 'leaf', color: colors.organic, tKey: 'mat_organic' },
  ewaste: { icon: 'chip', color: colors.ewaste, tKey: 'mat_ewaste' },
  mixed: { icon: 'recycle-variant', color: colors.green500, tKey: 'mat_mixed' },
};

export function MaterialIcon({ material = 'mixed', size = 44, plain = false }) {
  const m = MATERIALS[material] || MATERIALS.mixed;
  if (plain) {
    return <MaterialCommunityIcons name={m.icon} size={size} color={m.color} />;
  }
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 3,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: m.color + '22',
      }}
    >
      <MaterialCommunityIcons name={m.icon} size={size * 0.56} color={m.color} />
    </View>
  );
}

export default MaterialIcon;
