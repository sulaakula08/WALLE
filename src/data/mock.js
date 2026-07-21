// Демо-данные для прототипа. Координаты — Астана.

export const collectionPoints = [
  {
    id: 'cp1',
    name: 'EcoPoint Сарыарқа',
    address: 'пр. Сарыарқа, 12',
    lat: 51.1801,
    lng: 71.446,
    distanceKm: 0.8,
    open: true,
    hours: '08:00–20:00',
    accepts: ['plastic', 'paper', 'glass', 'metal'],
  },
  {
    id: 'cp2',
    name: 'Recycle Hub Есіл',
    address: 'ул. Кабанбай батыра, 53',
    lat: 51.126,
    lng: 71.43,
    distanceKm: 1.6,
    open: true,
    hours: '09:00–21:00',
    accepts: ['plastic', 'paper', 'ewaste'],
  },
  {
    id: 'cp3',
    name: 'Зелёный двор',
    address: 'ул. Сыганак, 18',
    lat: 51.09,
    lng: 71.416,
    distanceKm: 2.3,
    open: false,
    hours: '10:00–18:00',
    accepts: ['glass', 'metal', 'organic'],
  },
  {
    id: 'cp4',
    name: 'TazaLab',
    address: 'пр. Мангилик Ел, 8',
    lat: 51.089,
    lng: 71.47,
    distanceKm: 3.1,
    open: true,
    hours: '24/7',
    accepts: ['plastic', 'paper', 'glass', 'metal', 'ewaste'],
  },
  {
    id: 'cp5',
    name: 'ЭкоСтанция Алматы',
    address: 'ул. Достык, 91',
    lat: 51.155,
    lng: 71.41,
    distanceKm: 4.0,
    open: true,
    hours: '08:00–22:00',
    accepts: ['organic', 'paper'],
  },
];

export const clans = [
  { id: 'c1', name: 'Astana Green', emoji: '🌿', members: 248, points: 184200, city: 'Астана' },
  { id: 'c2', name: 'Таза Қала', emoji: '💧', members: 193, points: 167800, city: 'Алматы' },
  { id: 'c3', name: 'EcoWarriors', emoji: '⚡', members: 176, points: 152400, city: 'Шымкент' },
  { id: 'c4', name: 'Жасыл Отау', emoji: '🍃', members: 142, points: 138900, city: 'Астана' },
  { id: 'c5', name: 'Recyclers KZ', emoji: '♻️', members: 121, points: 121500, city: 'Караганда' },
];

export const badges = [
  { id: 'b1', name: 'Первый шаг', icon: 'foot-print', earned: true, color: '#27AE60' },
  { id: 'b2', name: '10 кг спасено', icon: 'weight-kilogram', earned: true, color: '#3FA9F5' },
  { id: 'b3', name: 'Мастер сортировки', icon: 'sort-variant', earned: true, color: '#F2C14E' },
  { id: 'b4', name: 'Эрудит', icon: 'brain', earned: true, color: '#2CC5C0' },
  { id: 'b5', name: 'Неделя подряд', icon: 'fire', earned: false, color: '#C46A34' },
  { id: 'b6', name: 'Эко-легенда', icon: 'crown', earned: false, color: '#9AA5B1' },
];

// Стартовые записи цифрового паспорта
export const initialPassport = [
  {
    id: 'WL-8F3A21',
    material: 'plastic',
    label: 'ПЭТ-бутылка',
    weightKg: 0.4,
    date: '2026-07-20',
    stepIndex: 4, // полностью переработано
    verifiedBy: 'KazRecycle Plant #2',
  },
  {
    id: 'WL-7B9C04',
    material: 'paper',
    label: 'Картонная упаковка',
    weightKg: 1.2,
    date: '2026-07-18',
    stepIndex: 3, // на сортировке
    verifiedBy: null,
  },
  {
    id: 'WL-5D1E77',
    material: 'glass',
    label: 'Стеклянная банка',
    weightKg: 0.6,
    date: '2026-07-15',
    stepIndex: 4,
    verifiedBy: 'GlassCycle Astana',
  },
];

export const passportSteps = [
  'passport_step_handed',
  'passport_step_collected',
  'passport_step_transported',
  'passport_step_sorted',
  'passport_step_recycled',
];

export const wasteTypeOptions = ['plastic', 'paper', 'glass', 'metal', 'organic', 'ewaste'];

export default { collectionPoints, clans, badges, initialPassport, passportSteps, wasteTypeOptions };
