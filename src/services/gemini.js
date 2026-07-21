// Интеграция Google Gemini (Generative Language API).
// Две основные функции: распознавание отходов по фото и генерация эко-квизов.
import { GEMINI_API_KEY, GEMINI_MODEL, GEMINI_BASE } from '../config';

const endpoint = () =>
  `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

// Низкоуровневый вызов generateContent
async function callGemini(parts, { json = false, schema = null, temperature = 0.4 } = {}) {
  const body = {
    contents: [{ role: 'user', parts }],
    generationConfig: {
      temperature,
      ...(json ? { responseMimeType: 'application/json' } : {}),
      ...(schema ? { responseSchema: schema } : {}),
    },
  };

  const res = await fetch(endpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ?? '';
  return text;
}

// Аккуратно извлечь JSON, даже если модель обернула его в текст/маркдаун
function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/[[{][\s\S]*[\]}]/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    throw new Error('Не удалось разобрать ответ модели');
  }
}

const LANG_LABEL = { ru: 'русском', kz: 'казахском' };

/**
 * Распознать тип отхода по изображению (base64 JPEG).
 * @returns {Promise<{material, label, recyclable, confidence, instructions, bin, tip}>}
 */
export async function recognizeWaste(base64Jpeg, lang = 'ru') {
  const langName = LANG_LABEL[lang] || 'русском';
  const prompt = `Ты — эксперт по сортировке отходов в приложении Walley. На фото один предмет отхода. Определи основной материал.
Ответь СТРОГО в JSON на ${langName} языке со схемой:
{
  "material": один из ["plastic","paper","glass","metal","organic","ewaste","mixed"],
  "label": короткое название предмета (2-3 слова),
  "recyclable": true | false,
  "confidence": число 0-100,
  "instructions": как подготовить к сдаче (1-2 предложения),
  "bin": в какой контейнер по цвету,
  "tip": короткий эко-факт об этом материале
}
Без пояснений вне JSON.`;

  const parts = [
    { text: prompt },
    { inline_data: { mime_type: 'image/jpeg', data: base64Jpeg } },
  ];

  const text = await callGemini(parts, { json: true, temperature: 0.2 });
  const obj = parseJson(text);
  return {
    material: obj.material || 'mixed',
    label: obj.label || '',
    recyclable: obj.recyclable !== false,
    confidence: Math.round(Number(obj.confidence) || 0),
    instructions: obj.instructions || '',
    bin: obj.bin || '',
    tip: obj.tip || '',
  };
}

/**
 * Сгенерировать эко-квиз.
 * @returns {Promise<Array<{question, options:string[4], correctIndex, explanation}>>}
 */
export async function generateQuiz(topic, lang = 'ru', count = 5) {
  const langName = LANG_LABEL[lang] || 'русском';
  const prompt = `Составь эко-квиз из ${count} вопросов на ${langName} языке по теме "${topic}" (экология, переработка, устойчивое развитие в Казахстане и мире).
Каждый вопрос — с 4 вариантами ответа, ровно один верный.
Верни СТРОГО JSON-массив:
[{"question":"...","options":["...","...","...","..."],"correctIndex":0,"explanation":"почему верно (1 предложение)"}]
Без текста вне JSON.`;

  const text = await callGemini([{ text: prompt }], { json: true, temperature: 0.8 });
  const arr = parseJson(text);
  if (!Array.isArray(arr)) throw new Error('Ожидался массив вопросов');
  return arr
    .filter((q) => q && q.question && Array.isArray(q.options) && q.options.length >= 2)
    .map((q) => ({
      question: q.question,
      options: q.options.slice(0, 4),
      correctIndex: Math.max(0, Math.min(q.options.length - 1, Number(q.correctIndex) || 0)),
      explanation: q.explanation || '',
    }));
}

/** Короткий эко-совет дня */
export async function ecoTip(lang = 'ru') {
  const langName = LANG_LABEL[lang] || 'русском';
  const text = await callGemini(
    [{ text: `Дай один короткий вдохновляющий эко-совет дня на ${langName} языке, до 15 слов. Только текст.` }],
    { temperature: 1.0 }
  );
  return text.trim();
}

export default { recognizeWaste, generateQuiz, ecoTip };
