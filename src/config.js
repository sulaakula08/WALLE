// Конфигурация ключей и моделей.
// ВНИМАНИЕ: ключ ниже виден в клиентском коде. Для продакшена вынесите
// вызовы Gemini на бэкенд-прокси и храните ключ в переменных окружения.
// Здесь ключ оставлен для быстрого прототипа/демо.

export const GEMINI_API_KEY = 'AIzaSyDPm4e0Cxip_Sf8hUWRt_9Buf5_WHlRQ1E';

// Быстрая и мультимодальная модель (текст + изображения)
export const GEMINI_MODEL = 'gemini-2.5-flash';

export const GEMINI_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

export default { GEMINI_API_KEY, GEMINI_MODEL, GEMINI_BASE };
