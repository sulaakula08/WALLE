import React, { createContext, useContext, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Полные словари RU / KZ
export const dictionaries = {
  ru: {
    lang_name: 'Рус',
    app_tagline: 'Умная переработка',

    // Онбординг / регистрация
    onb_welcome: 'Добро пожаловать в Walley',
    onb_subtitle: 'Создадим профиль за 10 секунд',
    onb_name: 'Как вас зовут?',
    onb_name_ph: 'Ваше имя',
    onb_gender: 'Пол',
    gender_male: 'Мужской',
    gender_female: 'Женский',
    gender_other: 'Не указывать',
    onb_city: 'Город',
    onb_start: 'Начать',
    onb_name_required: 'Введите имя, чтобы продолжить',
    mascot_hi: 'Привет! Я Walleхан',
    mascot_sub: 'Твой эко-помощник',

    // Навигация
    tab_home: 'Главная',
    tab_map: 'Карта',
    tab_scan: 'Сканер',
    tab_passport: 'Паспорт',
    tab_profile: 'Профиль',

    // Общее
    greeting_morning: 'Доброе утро',
    greeting_day: 'Добрый день',
    greeting_evening: 'Добрый вечер',
    see_all: 'Все',
    open: 'Открыть',
    close: 'Закрыть',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    loading: 'Загрузка…',
    km_away: 'км',
    points: 'баллов',
    kg: 'кг',

    // Главная
    home_eco_score: 'Эко-рейтинг',
    home_level: 'Уровень',
    home_co2_saved: 'CO₂ сэкономлено',
    home_recycled: 'Переработано',
    home_quick: 'Быстрые действия',
    home_scan: 'Сканировать',
    home_scan_desc: 'ИИ определит тип',
    home_call_robot: 'Вызвать робота',
    home_call_robot_desc: 'Заберёт отходы',
    home_map: 'Пункты приёма',
    home_map_desc: 'Рядом с вами',
    home_quiz: 'Эко-квиз',
    home_quiz_desc: 'Учись играя',
    home_activity: 'Недавняя активность',
    home_streak: 'дней подряд',
    home_next_level: 'до следующего уровня',

    // Карта
    map_title: 'Пункты приёма',
    map_subtitle: 'Найдите ближайший пункт сортировки',
    map_search: 'Поиск пункта или адреса',
    map_open_now: 'Открыто',
    map_closed: 'Закрыто',
    map_accepts: 'Принимает',
    map_route: 'Маршрут',
    map_filter_all: 'Все',

    // Сканер
    scan_title: 'ИИ-распознавание',
    scan_hint: 'Наведите камеру на отход',
    scan_capture: 'Распознать',
    scan_analyzing: 'Анализирую отход…',
    scan_gallery: 'Из галереи',
    scan_result: 'Результат',
    scan_material: 'Материал',
    scan_recyclable: 'Перерабатывается',
    scan_not_recyclable: 'Не перерабатывается',
    scan_how: 'Как подготовить',
    scan_bin: 'Контейнер',
    scan_nearest: 'Ближайший пункт',
    scan_add_passport: 'Добавить в паспорт',
    scan_retake: 'Ещё раз',
    scan_no_permission: 'Нет доступа к камере',
    scan_grant: 'Разрешить камеру',
    scan_confidence: 'Уверенность',
    scan_error: 'Не удалось распознать. Попробуйте ещё раз.',
    scan_added: 'Добавлено в цифровой паспорт!',

    // Робот
    robot_title: 'Вызов робота',
    robot_subtitle: 'Робот заберёт отходы и доставит на сортировку',
    robot_address: 'Адрес',
    robot_address_ph: 'Улица, дом, кв.',
    robot_waste_type: 'Тип отходов',
    robot_weight: 'Примерный вес',
    robot_when: 'Когда',
    robot_now: 'Сейчас',
    robot_schedule: 'Запланировать',
    robot_call: 'Вызвать робота',
    robot_eta: 'Прибытие через',
    robot_min: 'мин',
    robot_status_assigned: 'Робот назначен',
    robot_status_way: 'Робот в пути',
    robot_report: 'Робот также фиксирует переполненные контейнеры и свалки',
    robot_called: 'Робот вызван! Отслеживайте его в приложении.',

    // Паспорт
    passport_title: 'Цифровой паспорт',
    passport_subtitle: 'Путь ваших отходов в реальном времени',
    passport_total: 'Всего сдано',
    passport_verified: 'Подтверждено',
    passport_id: 'ID отхода',
    passport_track: 'Путь отхода',
    passport_step_handed: 'Передано',
    passport_step_collected: 'Собрано роботом',
    passport_step_transported: 'Транспортировка',
    passport_step_sorted: 'Сортировка',
    passport_step_recycled: 'Переработано',
    passport_verified_by: 'Подтверждено переработчиком',
    passport_pending: 'В процессе',
    passport_contribution: 'Ваш вклад',
    passport_empty: 'Пока нет записей. Отсканируйте первый отход!',

    // Квиз
    quiz_title: 'Эко-квиз',
    quiz_subtitle: 'Проверь свои знания об экологии',
    quiz_start: 'Начать квиз',
    quiz_generating: 'Генерирую вопросы…',
    quiz_question: 'Вопрос',
    quiz_of: 'из',
    quiz_next: 'Далее',
    quiz_finish: 'Завершить',
    quiz_correct: 'Верно!',
    quiz_wrong: 'Неверно',
    quiz_result: 'Ваш результат',
    quiz_earned: 'Вы заработали',
    quiz_again: 'Ещё раз',
    quiz_topic: 'Тема',

    // Профиль / кланы
    profile_title: 'Профиль',
    profile_level: 'Уровень',
    profile_xp: 'опыта',
    profile_badges: 'Достижения',
    profile_clan: 'Мой клан',
    profile_clan_rank: 'Место клана',
    profile_leaderboard: 'Рейтинг кланов',
    profile_members: 'участников',
    profile_join_clan: 'Вступить в клан',
    profile_stats: 'Статистика',
    profile_language: 'Язык',
    profile_settings: 'Настройки',
    profile_this_week: 'на этой неделе',

    // Материалы
    mat_plastic: 'Пластик',
    mat_paper: 'Бумага',
    mat_glass: 'Стекло',
    mat_metal: 'Металл',
    mat_organic: 'Органика',
    mat_ewaste: 'Электроника',
    mat_mixed: 'Смешанное',
  },

  kz: {
    lang_name: 'Қаз',
    app_tagline: 'Ақылды қайта өңдеу',

    // Онбординг / тіркеу
    onb_welcome: 'Walley-ге қош келдіңіз',
    onb_subtitle: 'Профильді 10 секундта жасаймыз',
    onb_name: 'Атыңыз кім?',
    onb_name_ph: 'Атыңыз',
    onb_gender: 'Жынысы',
    gender_male: 'Ер',
    gender_female: 'Әйел',
    gender_other: 'Көрсетпеу',
    onb_city: 'Қала',
    onb_start: 'Бастау',
    onb_name_required: 'Жалғастыру үшін атыңызды енгізіңіз',
    mascot_hi: 'Сәлем! Мен Walleханмын',
    mascot_sub: 'Сенің эко-көмекшің',

    tab_home: 'Басты бет',
    tab_map: 'Карта',
    tab_scan: 'Сканер',
    tab_passport: 'Паспорт',
    tab_profile: 'Профиль',

    greeting_morning: 'Қайырлы таң',
    greeting_day: 'Қайырлы күн',
    greeting_evening: 'Қайырлы кеш',
    see_all: 'Барлығы',
    open: 'Ашу',
    close: 'Жабу',
    cancel: 'Бас тарту',
    confirm: 'Растау',
    loading: 'Жүктелуде…',
    km_away: 'км',
    points: 'ұпай',
    kg: 'кг',

    home_eco_score: 'Эко-рейтинг',
    home_level: 'Деңгей',
    home_co2_saved: 'CO₂ үнемделді',
    home_recycled: 'Қайта өңделді',
    home_quick: 'Жылдам әрекеттер',
    home_scan: 'Сканерлеу',
    home_scan_desc: 'ЖИ түрін анықтайды',
    home_call_robot: 'Роботты шақыру',
    home_call_robot_desc: 'Қалдықты алады',
    home_map: 'Қабылдау пункттері',
    home_map_desc: 'Жаныңызда',
    home_quiz: 'Эко-викторина',
    home_quiz_desc: 'Ойнап үйрен',
    home_activity: 'Соңғы әрекеттер',
    home_streak: 'күн қатарынан',
    home_next_level: 'келесі деңгейге дейін',

    map_title: 'Қабылдау пункттері',
    map_subtitle: 'Ең жақын сұрыптау пунктін табыңыз',
    map_search: 'Пункт немесе мекенжай іздеу',
    map_open_now: 'Ашық',
    map_closed: 'Жабық',
    map_accepts: 'Қабылдайды',
    map_route: 'Бағыт',
    map_filter_all: 'Барлығы',

    scan_title: 'ЖИ-тану',
    scan_hint: 'Камераны қалдыққа бағыттаңыз',
    scan_capture: 'Тану',
    scan_analyzing: 'Қалдықты талдаудамын…',
    scan_gallery: 'Галереядан',
    scan_result: 'Нәтиже',
    scan_material: 'Материал',
    scan_recyclable: 'Қайта өңделеді',
    scan_not_recyclable: 'Қайта өңделмейді',
    scan_how: 'Қалай дайындау керек',
    scan_bin: 'Контейнер',
    scan_nearest: 'Ең жақын пункт',
    scan_add_passport: 'Паспортқа қосу',
    scan_retake: 'Қайтадан',
    scan_no_permission: 'Камераға рұқсат жоқ',
    scan_grant: 'Камераға рұқсат беру',
    scan_confidence: 'Сенімділік',
    scan_error: 'Тану мүмкін болмады. Қайталап көріңіз.',
    scan_added: 'Цифрлық паспортқа қосылды!',

    robot_title: 'Роботты шақыру',
    robot_subtitle: 'Робот қалдықты алып, сұрыптауға жеткізеді',
    robot_address: 'Мекенжай',
    robot_address_ph: 'Көше, үй, пәтер',
    robot_waste_type: 'Қалдық түрі',
    robot_weight: 'Шамамен салмағы',
    robot_when: 'Қашан',
    robot_now: 'Қазір',
    robot_schedule: 'Жоспарлау',
    robot_call: 'Роботты шақыру',
    robot_eta: 'Келу уақыты',
    robot_min: 'мин',
    robot_status_assigned: 'Робот тағайындалды',
    robot_status_way: 'Робот жолда',
    robot_report: 'Робот сонымен қатар толып кеткен контейнерлер мен үйінділерді тіркейді',
    robot_called: 'Робот шақырылды! Оны қолданбада бақылаңыз.',

    passport_title: 'Цифрлық паспорт',
    passport_subtitle: 'Қалдықтарыңыздың нақты уақыттағы жолы',
    passport_total: 'Барлығы тапсырылды',
    passport_verified: 'Расталды',
    passport_id: 'Қалдық ID',
    passport_track: 'Қалдық жолы',
    passport_step_handed: 'Тапсырылды',
    passport_step_collected: 'Робот жинады',
    passport_step_transported: 'Тасымалдау',
    passport_step_sorted: 'Сұрыптау',
    passport_step_recycled: 'Қайта өңделді',
    passport_verified_by: 'Қайта өңдеуші растады',
    passport_pending: 'Үдерісте',
    passport_contribution: 'Сіздің үлесіңіз',
    passport_empty: 'Әзірге жазба жоқ. Алғашқы қалдықты сканерлеңіз!',

    quiz_title: 'Эко-викторина',
    quiz_subtitle: 'Экология туралы біліміңізді тексеріңіз',
    quiz_start: 'Викторинаны бастау',
    quiz_generating: 'Сұрақтарды генерациялаудамын…',
    quiz_question: 'Сұрақ',
    quiz_of: '/',
    quiz_next: 'Келесі',
    quiz_finish: 'Аяқтау',
    quiz_correct: 'Дұрыс!',
    quiz_wrong: 'Қате',
    quiz_result: 'Сіздің нәтижеңіз',
    quiz_earned: 'Сіз таптыңыз',
    quiz_again: 'Қайтадан',
    quiz_topic: 'Тақырып',

    profile_title: 'Профиль',
    profile_level: 'Деңгей',
    profile_xp: 'тәжірибе',
    profile_badges: 'Жетістіктер',
    profile_clan: 'Менің кланым',
    profile_clan_rank: 'Клан орны',
    profile_leaderboard: 'Клан рейтингі',
    profile_members: 'қатысушы',
    profile_join_clan: 'Кланға кіру',
    profile_stats: 'Статистика',
    profile_language: 'Тіл',
    profile_settings: 'Баптаулар',
    profile_this_week: 'осы аптада',

    mat_plastic: 'Пластик',
    mat_paper: 'Қағаз',
    mat_glass: 'Шыны',
    mat_metal: 'Металл',
    mat_organic: 'Органика',
    mat_ewaste: 'Электроника',
    mat_mixed: 'Аралас',
  },
};

const I18nContext = createContext(null);
const STORAGE_KEY = 'walley.lang';

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('ru');

  React.useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((v) => {
      if (v === 'ru' || v === 'kz') setLang(v);
    });
  }, []);

  const changeLang = useCallback((next) => {
    setLang(next);
    AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'ru' ? 'kz' : 'ru';
      AsyncStorage.setItem(STORAGE_KEY, next).catch(() => {});
      return next;
    });
  }, []);

  const t = useCallback(
    (key) => dictionaries[lang][key] ?? dictionaries.ru[key] ?? key,
    [lang]
  );

  return (
    <I18nContext.Provider value={{ lang, t, changeLang, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
}

export default I18nContext;
