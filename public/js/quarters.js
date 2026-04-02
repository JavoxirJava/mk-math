// ════════════════════════════════════════════════════
//  UzMath Mini — Chorak tizimi (O'zbekiston vaqti +5)
// ════════════════════════════════════════════════════

// Choraklar va ta'tillar (oy-kun formatida)
// Eslatma: academic_year "2025-2026" formatida — sentyabrdan boshlanadi
const QUARTERS = [
  { q: 1, startMonth: 9,  startDay: 6,  endMonth: 11, endDay: 2  },
  { q: 2, startMonth: 11, startDay: 11, endMonth: 12, endDay: 15 },
  { q: 3, startMonth: 1,  startDay: 11, endMonth: 3,  endDay: 19 },
  { q: 4, startMonth: 3,  startDay: 28, endMonth: 5,  endDay: 23 }
];

/**
 * Joriy o'quv yilini aniqlash
 * Sentyabrdan boshlanadi: 2025-yil sentyabr = "2025-2026"
 */
function getAcademicYear(date) {
  const d = date || getTashkentDate();
  const month = d.getMonth() + 1; // 1-12
  const year = d.getFullYear();

  if (month >= 9) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

/**
 * Berilgan sana qaysi chorakka tegishli ekanini aniqlash
 * Qaytaradi: { quarter: 1-4, isVacation: false, academicYear: "2025-2026" }
 * yoki { quarter: 0, isVacation: true, vacationName: "...", academicYear: "..." }
 */
function getCurrentQuarterInfo(date) {
  const d = date || getTashkentDate();
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const academicYear = getAcademicYear(d);

  // Har bir chorakni tekshirish
  for (const q of QUARTERS) {
    if (isDateInRange(month, day, q.startMonth, q.startDay, q.endMonth, q.endDay)) {
      return {
        quarter: q.q,
        isVacation: false,
        academicYear,
        label: `${q.q}-chorak`
      };
    }
  }

  // Agar hech qaysi chorakka tushmasa — ta'til
  return {
    quarter: getClosestQuarter(month, day),
    isVacation: true,
    academicYear,
    label: getVacationName(month, day)
  };
}

/**
 * Sana berilgan oraliqda ekanini tekshirish
 * Yil chegarasini ham hisobga oladi (masalan: noyabr → yanvar)
 */
function isDateInRange(month, day, startMonth, startDay, endMonth, endDay) {
  const current = month * 100 + day;
  const start = startMonth * 100 + startDay;
  const end = endMonth * 100 + endDay;

  if (start <= end) {
    // Oddiy holat: bir yil ichida (masalan: sentyabr → noyabr)
    return current >= start && current <= end;
  } else {
    // Yil o'tishi (masalan: noyabr → yanvar) — bu holatda bo'lmaydi bizda
    return current >= start || current <= end;
  }
}

/**
 * Ta'til vaqtida eng yaqin chorakni aniqlash
 * (ta'til paytida qaysi chorak raqamini ishlatish kerak)
 */
function getClosestQuarter(month, day) {
  const md = month * 100 + day;

  // 3-noyabr — 10-noyabr: 1-chorak ta'tili
  if (md >= 1103 && md <= 1110) return 1;
  // 16-dekabr — 10-yanvar: 2-chorak ta'tili
  if (md >= 1216 || md <= 110) return 2;
  // 20-mart — 27-mart: 3-chorak ta'tili
  if (md >= 320 && md <= 327) return 3;
  // 24-may — 5-sentyabr: yozgi ta'til (4-chorak keyini)
  if (md >= 524 && md <= 905) return 4;

  // Default
  return 1;
}

/**
 * Ta'til nomini aniqlash
 */
function getVacationName(month, day) {
  const md = month * 100 + day;

  if (md >= 1103 && md <= 1110) return 'Kuzgi ta\'til';
  if (md >= 1216 || md <= 110) return 'Qishki ta\'til';
  if (md >= 320 && md <= 327) return 'Bahorgi ta\'til';
  if (md >= 524 && md <= 905) return 'Yozgi ta\'til';

  return 'Ta\'til';
}

/**
 * Ball va valyuta hisoblash
 * correctCount — to'g'ri javoblar soni
 * Qaytaradi: { score, diamonds, goldCoins }
 */
function calculateRewards(correctCount, isVacation) {
  const score = correctCount * 100;
  const diamonds = isVacation ? 0 : Math.floor(score / 100);
  const goldCoins = isVacation ? Math.floor(score / 100) : 0;

  return { score, diamonds, goldCoins };
}

/**
 * Kunlik limit tekshirish
 * @returns {boolean} true agar limit to'lmagan bo'lsa
 */
function canPlayMore(todayCount, limit = 200) {
  return todayCount < limit;
}

/**
 * Qolgan masalalar sonini hisoblash
 */
function remainingProblems(todayCount, limit = 200) {
  return Math.max(0, limit - todayCount);
}

// ════════════════════════════════════════
//  CHORAK PROGRESS UI HELPERS
// ════════════════════════════════════════

/**
 * Chorak progress foizini hisoblash (necha kun o'tdi)
 */
function getQuarterProgress(date) {
  const d = date || getTashkentDate();
  const info = getCurrentQuarterInfo(d);
  if (info.isVacation) return 100;

  const q = QUARTERS.find(x => x.q === info.quarter);
  if (!q) return 0;

  const year = d.getFullYear();
  const startDate = new Date(year, q.startMonth - 1, q.startDay);
  const endDate = new Date(year, q.endMonth - 1, q.endDay);

  // Agar chorak yil o'tishida bo'lsa
  if (q.startMonth > q.endMonth) {
    if (d.getMonth() + 1 < q.startMonth) {
      startDate.setFullYear(year - 1);
    } else {
      endDate.setFullYear(year + 1);
    }
  }

  const totalDays = (endDate - startDate) / 86400000;
  const elapsed = (d - startDate) / 86400000;

  return Math.min(100, Math.max(0, Math.round((elapsed / totalDays) * 100)));
}

/**
 * Chorak qolgan kunlarini hisoblash
 */
function getQuarterRemainingDays(date) {
  const d = date || getTashkentDate();
  const info = getCurrentQuarterInfo(d);
  if (info.isVacation) return 0;

  const q = QUARTERS.find(x => x.q === info.quarter);
  if (!q) return 0;

  const year = d.getFullYear();
  const endDate = new Date(year, q.endMonth - 1, q.endDay);

  if (q.startMonth > q.endMonth && d.getMonth() + 1 >= q.startMonth) {
    endDate.setFullYear(year + 1);
  }

  const remaining = Math.ceil((endDate - d) / 86400000);
  return Math.max(0, remaining);
}
