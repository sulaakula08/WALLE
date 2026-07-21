import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initialPassport } from '../data/mock';

// Глобальное состояние: цифровой паспорт, очки/уровень, статистика.
const AppContext = createContext(null);
const KEY = 'walley.state.v1';

// Порог опыта для уровня n
const levelThreshold = (lvl) => 500 + (lvl - 1) * 350;

function computeLevel(xp) {
  let lvl = 1;
  let remain = xp;
  while (remain >= levelThreshold(lvl)) {
    remain -= levelThreshold(lvl);
    lvl += 1;
  }
  return { level: lvl, into: remain, need: levelThreshold(lvl) };
}

function genId() {
  const rnd = Math.random().toString(16).slice(2, 8).toUpperCase();
  return `WL-${rnd}`;
}

export function AppProvider({ children }) {
  const [passport, setPassport] = useState(initialPassport);
  const [xp, setXp] = useState(2340);
  const [streak, setStreak] = useState(6);

  React.useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (!raw) return;
      try {
        const s = JSON.parse(raw);
        if (Array.isArray(s.passport)) setPassport(s.passport);
        if (typeof s.xp === 'number') setXp(s.xp);
        if (typeof s.streak === 'number') setStreak(s.streak);
      } catch {}
    });
  }, []);

  const persist = useCallback((next) => {
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const addWaste = useCallback(
    ({ material, label, weightKg = 0.3 }) => {
      const entry = {
        id: genId(),
        material,
        label,
        weightKg,
        date: new Date().toISOString().slice(0, 10),
        stepIndex: 1, // собрано / передано
        verifiedBy: null,
      };
      setPassport((prev) => {
        const next = [entry, ...prev];
        setXp((x) => {
          const nx = x + 120;
          persist({ passport: next, xp: nx, streak });
          return nx;
        });
        return next;
      });
      return entry;
    },
    [persist, streak]
  );

  const addXp = useCallback(
    (amount) => {
      setXp((x) => {
        const nx = x + amount;
        persist({ passport, xp: nx, streak });
        return nx;
      });
    },
    [passport, streak, persist]
  );

  const stats = useMemo(() => {
    const totalKg = passport.reduce((s, e) => s + (e.weightKg || 0), 0);
    const recycled = passport.filter((e) => e.stepIndex >= 4).length;
    const co2 = totalKg * 1.7; // условный коэффициент кг CO2 на кг переработки
    const { level, into, need } = computeLevel(xp);
    // Эко-рейтинг 0..100 — производная от опыта
    const ecoScore = Math.min(100, 40 + Math.round(xp / 60));
    return {
      totalKg: Math.round(totalKg * 10) / 10,
      recycled,
      total: passport.length,
      co2: Math.round(co2 * 10) / 10,
      level,
      levelProgress: need ? into / need : 0,
      xpInto: into,
      xpNeed: need,
      ecoScore,
    };
  }, [passport, xp]);

  const value = useMemo(
    () => ({ passport, xp, streak, stats, addWaste, addXp }),
    [passport, xp, streak, stats, addWaste, addXp]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
