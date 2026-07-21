// Walley — эко дизайн-система
// Палитра вдохновлена природой Казахстана: степь, листва, глина, небо.

export const colors = {
  // Базовые зелёные (переработка / природа)
  forest900: '#0B3D2E',
  forest800: '#0F4D3A',
  forest700: '#14603F',
  green600: '#1E8E5A',
  green500: '#27AE60',
  green400: '#4CD08A',
  mint300: '#7EE2B0',
  mint100: '#D6F5E4',

  // Земляные / акценты
  clay: '#C46A34',
  sand: '#E7D9B8',
  sun: '#F2C14E',
  sky: '#3FA9F5',
  water: '#2CC5C0',

  // Материалы отходов (единая легенда цветов)
  plastic: '#F2C14E', // пластик — жёлтый
  paper: '#3FA9F5',   // бумага — синий
  glass: '#2CC5C0',   // стекло — бирюза
  metal: '#9AA5B1',   // металл — серый
  organic: '#8FBF5B', // органика — салатовый
  ewaste: '#C46A34',  // электроника — терракота

  // Нейтральные (светлая тема)
  bg: '#F3F7F2',
  surface: '#FFFFFF',
  surfaceAlt: '#EAF3EC',
  border: '#DDE7DD',
  text: '#12261C',
  textMuted: '#5B6E62',
  textFaint: '#8CA096',

  white: '#FFFFFF',
  black: '#0A130E',
  danger: '#E15554',
  overlay: 'rgba(11,61,46,0.55)',
};

export const gradients = {
  brand: ['#0F4D3A', '#1E8E5A', '#27AE60'],
  mint: ['#27AE60', '#4CD08A'],
  night: ['#0B3D2E', '#0F4D3A'],
  sun: ['#F2C14E', '#F0A431'],
  water: ['#2CC5C0', '#3FA9F5'],
  card: ['#FFFFFF', '#F1F8F2'],
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 10,
  md: 16,
  lg: 22,
  xl: 28,
  pill: 999,
};

export const typography = {
  display: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
  h1: { fontSize: 26, fontWeight: '800', letterSpacing: -0.3 },
  h2: { fontSize: 20, fontWeight: '700' },
  h3: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '500' },
  bodyStrong: { fontSize: 15, fontWeight: '700' },
  caption: { fontSize: 13, fontWeight: '600' },
  tiny: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
};

export const shadow = {
  soft: {
    shadowColor: '#0B3D2E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
  card: {
    shadowColor: '#0B3D2E',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 8,
  },
  float: {
    shadowColor: '#0B3D2E',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 28,
    elevation: 14,
  },
};

// Цвет по типу материала
export const materialColor = (key) => colors[key] || colors.green500;

export default { colors, gradients, spacing, radius, typography, shadow, materialColor };
