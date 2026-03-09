// Grade 4 question generators
// Textbook: "Matematika 4-sinf" by Bikbayeva, Girfanova (2020)
// Constraints: numbers up to 1,000,000; multi-digit multiply/divide;
// simple/decimal fractions; equations; area/perimeter; speed/distance

const { rand, shuffle, makeOptions, formatQuestion } = require("./helpers");

// Million ichida raqamlash va taqqoslash
function millionNumeration(difficulty) {
  if (difficulty === 1) {
    // Compare 4-5 digit numbers
    const a = rand(1000, 99999);
    const b = rand(1000, 99999);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return {
      question: `${a.toLocaleString("uz")}  ☐  ${b.toLocaleString("uz")}`,
      answer,
      options: [">", "<", "="],
      type: "comparison"
    };
  } else if (difficulty === 2) {
    // How many thousands/hundreds in a number
    const n = rand(10000, 99999);
    const thousands = Math.floor(n / 1000);
    return formatQuestion(
      `${n} sonida nechta minglik bor?`,
      thousands,
      makeOptions(thousands, 4, 10)
    );
  } else {
    // Arrange digits to form largest/smallest number
    const digits = [rand(1, 9), rand(0, 9), rand(0, 9), rand(1, 9)];
    const sorted = [...digits].sort((a, b) => b - a);
    const answer = parseInt(sorted.join(""));
    return formatQuestion(
      `${digits.join(", ")} raqamlaridan tuzilgan eng katta son qaysi?`,
      answer,
      makeOptions(answer, 4, 2000)
    );
  }
}

// Million ichida qo'shish va ayirish
function millionAddSub(difficulty) {
  if (difficulty === 1) {
    const a = rand(1000, 9000);
    const b = rand(1000, 9000);
    const answer = a + b;
    return formatQuestion(`${a} + ${b} = ?`, answer, makeOptions(answer, 4, 1000));
  } else if (difficulty === 2) {
    const a = rand(10000, 90000);
    const b = rand(5000, a - 1000);
    const answer = a - b;
    return formatQuestion(`${a} − ${b} = ?`, answer, makeOptions(answer, 4, 2000));
  } else {
    // Three-term expression
    const a = rand(10000, 50000);
    const b = rand(5000, 20000);
    const c = rand(1000, 10000);
    const answer = a + b - c;
    return formatQuestion(
      `${a} + ${b} − ${c} = ?`,
      answer,
      makeOptions(answer, 4, 3000)
    );
  }
}

// Ko'p xonali ko'paytirish va bo'lish
function millionMultiplyDivide(difficulty) {
  if (difficulty === 1) {
    // Multiply by single digit: 320 × 4
    const a = rand(100, 500) * rand(1, 2);
    const b = rand(2, 5);
    const answer = a * b;
    return formatQuestion(`${a} × ${b} = ?`, answer, makeOptions(answer, 4, 200));
  } else if (difficulty === 2) {
    // Divide by single digit: 3600 ÷ 4
    const b = rand(2, 9);
    const q = rand(100, 1000);
    const a = b * q;
    return formatQuestion(`${a} ÷ ${b} = ?`, q, makeOptions(q, 4, 100));
  } else {
    // Multiply/divide by two-digit: 800 × 40, 14000 ÷ 70
    if (Math.random() > 0.5) {
      const a = rand(10, 90) * 10;
      const b = rand(2, 9) * 10;
      const answer = a * b;
      return formatQuestion(`${a} × ${b} = ?`, answer, makeOptions(answer, 4, 2000));
    }
    const b = rand(2, 9) * 10;
    const q = rand(10, 200);
    const a = b * q;
    return formatQuestion(`${a} ÷ ${b} = ?`, q, makeOptions(q, 4, 50));
  }
}

// Tenglamalar
function equationsGrade4(difficulty) {
  if (difficulty === 1) {
    // x + a = b
    const answer = rand(10, 200);
    const a = rand(10, 200);
    const b = answer + a;
    return formatQuestion(`x + ${a} = ${b}. x = ?`, answer, makeOptions(answer, 4, 30));
  } else if (difficulty === 2) {
    // a × x = b
    const answer = rand(2, 20);
    const a = rand(2, 9);
    const b = a * answer;
    return formatQuestion(`${a} × x = ${b}. x = ?`, answer, makeOptions(answer, 4, 8));
  } else {
    // a - x = b  or  x ÷ a = b
    if (Math.random() > 0.5) {
      const answer = rand(20, 200);
      const a = answer + rand(50, 300);
      const b = a - answer;
      return formatQuestion(`${a} − x = ${b}. x = ?`, answer, makeOptions(answer, 4, 40));
    }
    const a = rand(2, 9);
    const answer = a * rand(5, 50);
    const b = answer / a;
    return formatQuestion(`x ÷ ${a} = ${b}. x = ?`, answer, makeOptions(answer, 4, 30));
  }
}

// Kasrlar (oddiy va o'nli)
function fractionsGrade4(difficulty) {
  if (difficulty === 1) {
    // Compare fractions with same denominator
    const denom = [4, 5, 8, 10][rand(0, 3)];
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
  } else if (difficulty === 2) {
    // Find fraction of a number: 3/4 of 80 = ?
    const denom = [2, 4, 5, 10][rand(0, 3)];
    const numer = rand(1, denom - 1);
    const multiplier = rand(2, 10);
    const whole = denom * multiplier;
    const answer = numer * multiplier;
    return formatQuestion(
      `${whole} ning ${numer}/${denom} qismi nechta?`,
      answer,
      makeOptions(answer, 4, 10)
    );
  } else {
    // Decimal fractions: o'nli kasrlar comparison
    const a = rand(1, 9);
    const b = rand(0, 9);
    const c = rand(1, 9);
    const d = rand(0, 9);
    const left = parseFloat(`${a}.${b}`);
    const right = parseFloat(`${c}.${d}`);
    const answer = left > right ? ">" : left < right ? "<" : "=";
    return {
      question: `${left}  ☐  ${right}`,
      answer,
      options: [">", "<", "="],
      type: "comparison"
    };
  }
}

// O'rta arifmetik
function averageGrade4(difficulty) {
  let nums;
  if (difficulty === 1) {
    nums = [rand(5, 20), rand(5, 20)];
  } else if (difficulty === 2) {
    nums = [rand(10, 50), rand(10, 50), rand(10, 50)];
  } else {
    nums = [rand(10, 30), rand(10, 30), rand(10, 30), rand(10, 30)];
  }
  // Ensure clean average
  const sum = nums.reduce((s, n) => s + n, 0);
  const remainder = sum % nums.length;
  if (remainder !== 0) {
    nums[0] += nums.length - remainder;
  }
  const correctedSum = nums.reduce((s, n) => s + n, 0);
  const answer = correctedSum / nums.length;

  return formatQuestion(
    `${nums.join(", ")} sonlarining o'rta arifmetigini toping.`,
    answer,
    makeOptions(answer, 4, 10)
  );
}

// Yuza va perimetr (to'g'ri to'rtburchak, kvadrat)
function areaPerimeterGrade4(difficulty) {
  if (difficulty === 1) {
    // Rectangle area
    const a = rand(5, 30);
    const b = rand(3, 20);
    const answer = a * b;
    return formatQuestion(
      `To'g'ri to'rtburchakning bo'yi ${a} cm, eni ${b} cm. Yuzi necha cm²?`,
      answer,
      makeOptions(answer, 4, 50)
    );
  } else if (difficulty === 2) {
    // Find side from area
    const b = rand(3, 15);
    const answer = rand(5, 20);
    const area = answer * b;
    return formatQuestion(
      `To'g'ri to'rtburchakning yuzi ${area} cm², eni ${b} cm. Bo'yi necha cm?`,
      answer,
      makeOptions(answer, 4, 8)
    );
  } else {
    // Square: given perimeter, find area
    const side = rand(3, 20);
    const perimeter = side * 4;
    const answer = side * side;
    return formatQuestion(
      `Kvadratning perimetri ${perimeter} cm. Yuzi necha cm²?`,
      answer,
      makeOptions(answer, 4, 40)
    );
  }
}

// Harakat masalalari (tezlik, vaqt, masofa)
function speedDistanceGrade4(difficulty) {
  if (difficulty === 1) {
    // Distance = speed × time
    const speed = rand(3, 10) * 10;
    const time = rand(2, 5);
    const answer = speed * time;
    return formatQuestion(
      `Avtomobil tezligi ${speed} km/soat. ${time} soatda necha km yo'l bosadi?`,
      answer,
      makeOptions(answer, 4, 50)
    );
  } else if (difficulty === 2) {
    // Speed = distance / time
    const time = rand(2, 6);
    const speed = rand(3, 15) * 10;
    const distance = speed * time;
    return formatQuestion(
      `Poyezd ${time} soatda ${distance} km yo'l bosdi. Tezligi necha km/soat?`,
      speed,
      makeOptions(speed, 4, 20)
    );
  } else {
    // Time = distance / speed
    const speed = rand(4, 12) * 10;
    const answer = rand(2, 8);
    const distance = speed * answer;
    return formatQuestion(
      `Velosiped ${distance} km masofani ${speed} km/soat tezlikda bosib o'tdi. Necha soat yo'l yurdi?`,
      answer,
      makeOptions(answer, 4, 3)
    );
  }
}

module.exports = {
  millionNumeration,
  millionAddSub,
  millionMultiplyDivide,
  equationsGrade4,
  fractionsGrade4,
  averageGrade4,
  areaPerimeterGrade4,
  speedDistanceGrade4
};
