// Конфигурация моделей. Ключи вынесены в src/secrets.js (в .gitignore),
// чтобы не утекали в публичный репозиторий.
import { GEMINI_API_KEY as KEY, GOOGLE_MAPS_KEY as MAPS } from './secrets';

export const GEMINI_API_KEY = KEY;
export const GOOGLE_MAPS_KEY = MAPS;

// Есть ли валидный ключ Google Maps (иначе показываем стилизованную заглушку)
export const HAS_MAPS_KEY = Boolean(MAPS && MAPS.length > 10);

// Быстрая мультимодальная модель (текст + изображения)
export const GEMINI_MODEL = 'gemini-2.5-flash';

export const GEMINI_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

export default { GEMINI_API_KEY, GOOGLE_MAPS_KEY, HAS_MAPS_KEY, GEMINI_MODEL, GEMINI_BASE };
