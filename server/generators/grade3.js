// Grade 3 question generators
// Textbook: "Matematika 3-sinf" by Burxonov et al. (2019)
// Constraints: multiplication/division tables, written mult/div within 1000,
// 4-digit numbers up to 10000, basic fractions, perimeter, area intro

const { rand, shuffle, makeOptions, formatQuestion } = require("./helpers");

// Jadvaldan tashqari ko'paytirish va bo'lish (20·3, 60:3, 23·4, etc.)
function multiplyDivideTable(difficulty) {
  if (difficulty === 1) {
    // Simple: round × single digit (20·3, 30·4)
    const a = rand(2, 9) * 10;
    const b = rand(2, 5);
    const answer = a * b;
    return formatQuestion(`${a} × ${b} = ?`, answer, makeOptions(answer, 4, 30));
  } else if (difficulty === 2) {
    // 23·4, 4·23 type
    const a = rand(12, 30);
    const b = rand(2, 5);
    const answer = a * b;
    return formatQuestion(`${a} × ${b} = ?`, answer, makeOptions(answer, 4, 20));
  } else {
    // Division: 60:3, 72:4, 90:30
    const b = rand(2, 9);
    const q = rand(5, 30);
    const a = b * q;
    return formatQuestion(`${a} ÷ ${b} = ?`, q, makeOptions(q, 4, 10));
  }
}

// 1000 ichida yozma ko'paytirish (with carrying through tens/hundreds)
function writtenMultiplication(difficulty) {
  let a, b;
  if (difficulty === 1) {
    // No carrying: e.g., 213 × 2
    a = rand(100, 300);
    b = rand(2, 3);
  } else if (difficulty === 2) {
    // Carrying through tens: e.g., 164 × 3
    a = rand(100, 300);
    b = rand(2, 4);
  } else {
    // Full carrying: e.g., 248 × 4
    a = rand(100, 250);
    b = rand(3, 4);
  }
  const answer = a * b;
  return formatQuestion(`${a} × ${b} = ?`, answer, makeOptions(answer, 4, 50));
}

// 1000 ichida yozma bo'lish + qoldiqli bo'lish
function writtenDivision(difficulty) {
  if (difficulty === 1) {
    // Exact division: 396:3, 248:2
    const b = rand(2, 4);
    const q = rand(50, 250);
    const a = b * q;
    return formatQuestion(`${a} ÷ ${b} = ?`, q, makeOptions(q, 4, 30));
  } else if (difficulty === 2) {
    // Harder exact division: 852:4, 742:7
    const b = rand(3, 7);
    const q = rand(30, 150);
    const a = b * q;
    return formatQuestion(`${a} ÷ ${b} = ?`, q, makeOptions(q, 4, 20));
  } else {
    // Division with remainder (qoldiqli bo'lish)
    const b = rand(3, 8);
    const q = rand(10, 100);
    const r = rand(1, b - 1);
    const a = b * q + r;
    return {
      question: `${a} ÷ ${b} = ? (qoldiq ... )`,
      answer: q,
      remainder: r,
      options: makeOptions(q, 4, 10),
      type: "mcq"
    };
  }
}

// 10000 ichida raqamlash: 4 xonali sonlar bilan qo'shish/ayirish
function fourDigitNumbers(difficulty) {
  if (difficulty === 1) {
    // Round thousands: 2300 + 1400
    const a = rand(1, 5) * 1000 + rand(1, 5) * 100;
    const b = rand(1, 3) * 1000 + rand(1, 5) * 100;
    const answer = a + b;
    if (answer > 9999) return fourDigitNumbers(1);
    return formatQuestion(`${a} + ${b} = ?`, answer, makeOptions(answer, 4, 500));
  } else if (difficulty === 2) {
    // Subtraction
    const a = rand(3000, 9000);
    const b = rand(1000, a - 500);
    const answer = a - b;
    return formatQuestion(`${a} − ${b} = ?`, answer, makeOptions(answer, 4, 400));
  } else {
    // Mixed: add/sub with three numbers
    const a = rand(2000, 5000);
    const b = rand(500, 2000);
    const c = rand(100, 1000);
    const answer = a + b - c;
    return formatQuestion(
      `${a} + ${b} − ${c} = ?`,
      answer,
      makeOptions(answer, 4, 500)
    );
  }
}

// Oddiy kasrlar (fractions with denominator 2,3,4,6,8)
function fractionsBasic(difficulty) {
  if (difficulty === 1) {
    // What fraction is shaded? Simple halves, quarters
    const denom = [2, 4][rand(0, 1)];
    const numer = rand(1, denom - 1);
    const whole = denom * rand(2, 5);
    const answer = (whole / denom) * numer;
    return formatQuestion(
      `${whole} ning ${numer}/${denom} qismi nechta?`,
      answer,
      makeOptions(answer, 4, 5)
    );
  } else if (difficulty === 2) {
    // Compare fractions with same denominator
    const denom = [3, 4, 6][rand(0, 2)];
    const a = rand(1, denom - 1);
    let b = rand(1, denom - 1);
    while (b === a) b = rand(1, denom - 1);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return {
      question: `${a}/${denom}  ☐  ${b}/${denom}`,
      answer,
      options: [">", "<", "="],
      type: "comparison"
    };
  } else {
    // Find the number from its fraction
    const denom = [2, 3, 4, 6, 8][rand(0, 4)];
    const numer = rand(1, denom - 1);
    const part = rand(2, 8);
    const whole = (part * denom) / numer;
    if (!Number.isInteger(whole) || whole > 100) return fractionsBasic(3);
    return formatQuestion(
      `Sonning ${numer}/${denom} qismi ${part} ga teng. Son nechta?`,
      whole,
      makeOptions(whole, 4, 10)
    );
  }
}

// Perimetr: to'g'ri to'rtburchak va kvadrat
function perimeterGrade3(difficulty) {
  if (difficulty === 1) {
    // Square perimeter
    const side = rand(3, 15);
    const answer = side * 4;
    return formatQuestion(
      `Kvadratning tomoni ${side} cm. Perimetri necha cm?`,
      answer,
      makeOptions(answer, 4, 15)
    );
  } else if (difficulty === 2) {
    // Rectangle perimeter
    const a = rand(5, 20);
    const b = rand(3, 15);
    const answer = 2 * (a + b);
    return formatQuestion(
      `To'g'ri to'rtburchakning bo'yi ${a} cm, eni ${b} cm. Perimetri necha cm?`,
      answer,
      makeOptions(answer, 4, 15)
    );
  } else {
    // Find unknown side given perimeter
    const a = rand(5, 20);
    const perimeter = rand(30, 80);
    const b = perimeter / 2 - a;
    if (b <= 0 || !Number.isInteger(b)) return perimeterGrade3(3);
    return formatQuestion(
      `To'g'ri to'rtburchakning perimetri ${perimeter} cm, bo'yi ${a} cm. Eni necha cm?`,
      b,
      makeOptions(b, 4, 8)
    );
  }
}

// Sonlarni taqqoslash (1000 ichida)
function comparisonWithin1000(difficulty) {
  if (difficulty === 1) {
    const a = rand(100, 999);
    const b = rand(100, 999);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return {
      question: `${a}  ☐  ${b}`,
      answer,
      options: [">", "<", "="],
      type: "comparison"
    };
  } else if (difficulty === 2) {
    // Compare expressions
    const a = rand(100, 500);
    const b = rand(10, 200);
    const c = rand(200, 800);
    const left = a + b;
    const answer = left > c ? ">" : left < c ? "<" : "=";
    return {
      question: `${a} + ${b}  ☐  ${c}`,
      answer,
      options: [">", "<", "="],
      type: "comparison"
    };
  } else {
    // Compare two expressions
    const a = rand(100, 500);
    const b = rand(50, 300);
    const c = rand(100, 500);
    const d = rand(50, 300);
    const left = a + b;
    const right = c + d;
    const answer = left > right ? ">" : left < right ? "<" : "=";
    return {
      question: `${a} + ${b}  ☐  ${c} + ${d}`,
      answer,
      options: [">", "<", "="],
      type: "comparison"
    };
  }
}

// Yuz o'lchovi (area intro)
function areaIntroGrade3(difficulty) {
  if (difficulty === 1) {
    // Square area
    const side = rand(2, 10);
    const answer = side * side;
    return formatQuestion(
      `Kvadratning tomoni ${side} cm. Yuzi necha cm²?`,
      answer,
      makeOptions(answer, 4, 15)
    );
  } else if (difficulty === 2) {
    // Rectangle area
    const a = rand(3, 15);
    const b = rand(2, 10);
    const answer = a * b;
    return formatQuestion(
      `To'g'ri to'rtburchakning bo'yi ${a} cm, eni ${b} cm. Yuzi necha cm²?`,
      answer,
      makeOptions(answer, 4, 20)
    );
  } else {
    // Find unknown side given area
    const answer = rand(3, 12);
    const b = rand(2, 10);
    const area = answer * b;
    return formatQuestion(
      `To'g'ri to'rtburchakning yuzi ${area} cm², eni ${b} cm. Bo'yi necha cm?`,
      answer,
      makeOptions(answer, 4, 5)
    );
  }
}

module.exports = {
  multiplyDivideTable,
  writtenMultiplication,
  writtenDivision,
  fourDigitNumbers,
  fractionsBasic,
  perimeterGrade3,
  comparisonWithin1000,
  areaIntroGrade3
};
