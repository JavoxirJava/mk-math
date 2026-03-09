// Grade 2 question generators
// Textbook: "Matematika 2-sinf" (2021)
// Constraints: numbers within 100, basic multiplication/division intro,
// no 3-digit arithmetic, no fractions beyond halves/quarters

const { rand, makeOptions, formatQuestion } = require("./helpers");

// BOB 1: 100 ichida qo'shish
function additionWithin100(difficulty) {
  let a, b;
  if (difficulty === 1) {
    // Single digit or round numbers, no carrying
    a = rand(10, 40);
    b = rand(1, 9);
  } else if (difficulty === 2) {
    // Two-digit + one/two-digit, may carry
    a = rand(20, 60);
    b = rand(10, 30);
  } else {
    // Larger sums close to 100
    a = rand(30, 70);
    b = rand(10, 99 - a);
  }
  const answer = a + b;
  return formatQuestion(`${a} + ${b} = ?`, answer, makeOptions(answer, 4, 10));
}

// BOB 2: 100 ichida ayirish
function subtractionWithin100(difficulty) {
  let a, b;
  if (difficulty === 1) {
    a = rand(10, 50);
    b = rand(1, 9);
  } else if (difficulty === 2) {
    a = rand(30, 80);
    b = rand(10, a - 5);
  } else {
    a = rand(50, 99);
    b = rand(20, a - 1);
  }
  const answer = a - b;
  return formatQuestion(`${a} − ${b} = ?`, answer, makeOptions(answer, 4, 10));
}

// Sonlarni taqqoslash (>, <, =)
function comparisonWithin100(difficulty) {
  let a, b;
  if (difficulty === 1) {
    a = rand(1, 50);
    b = rand(1, 50);
  } else if (difficulty === 2) {
    a = rand(10, 99);
    b = rand(10, 99);
  } else {
    // Expressions: e.g., 30 + 15 vs 50
    const x = rand(10, 40);
    const y = rand(5, 30);
    a = x + y;
    b = rand(20, 80);
    const answer = a > b ? ">" : a < b ? "<" : "=";
    return {
      question: `${x} + ${y}  ☐  ${b}`,
      answer,
      options: [">", "<", "="],
      type: "comparison"
    };
  }
  const answer = a > b ? ">" : a < b ? "<" : "=";
  return {
    question: `${a}  ☐  ${b}`,
    answer,
    options: [">", "<", "="],
    type: "comparison"
  };
}

// BOB 4: Ko'paytirishga kirish (equal groups, repeated addition)
function multiplicationIntro(difficulty) {
  let a, b;
  if (difficulty === 1) {
    a = rand(2, 5);
    b = rand(2, 3);
  } else if (difficulty === 2) {
    a = rand(2, 5);
    b = rand(3, 5);
  } else {
    a = rand(3, 9);
    b = rand(2, 5);
  }
  const answer = a * b;
  // Present as repeated addition or multiplication
  if (difficulty === 1) {
    const parts = Array(b).fill(a).join(" + ");
    return formatQuestion(`${parts} = ?`, answer, makeOptions(answer, 4, 8));
  }
  return formatQuestion(`${a} × ${b} = ?`, answer, makeOptions(answer, 4, 8));
}

// BOB 5: Bo'lishga kirish (equal sharing)
function divisionIntro(difficulty) {
  let divisor, quotient;
  if (difficulty === 1) {
    divisor = rand(2, 3);
    quotient = rand(2, 5);
  } else if (difficulty === 2) {
    divisor = rand(2, 5);
    quotient = rand(2, 6);
  } else {
    divisor = rand(2, 9);
    quotient = rand(2, 9);
  }
  const dividend = divisor * quotient;
  const answer = quotient;
  return formatQuestion(
    `${dividend} ÷ ${divisor} = ?`,
    answer,
    makeOptions(answer, 4, 5)
  );
}

// BOB 6: Sonli ifodalar
function expressionsGrade2(difficulty) {
  if (difficulty === 1) {
    const a = rand(10, 40);
    const b = rand(5, 20);
    const c = rand(1, 10);
    const answer = a + b - c;
    return formatQuestion(`${a} + ${b} − ${c} = ?`, answer, makeOptions(answer, 4, 10));
  } else if (difficulty === 2) {
    const a = rand(2, 5);
    const b = rand(3, 8);
    const c = rand(5, 15);
    const answer = a * b + c;
    return formatQuestion(`${a} × ${b} + ${c} = ?`, answer, makeOptions(answer, 4, 10));
  } else {
    const a = rand(10, 50);
    const b = rand(2, 5);
    const c = rand(2, 4);
    const prod = b * c;
    const answer = a + prod;
    return formatQuestion(`${a} + ${b} × ${c} = ?`, answer, makeOptions(answer, 4, 10));
  }
}

// BOB 7: Butunning bo'laklari (halves, quarters)
function fractionsIntroGrade2(difficulty) {
  if (difficulty === 1) {
    // What is half of N?
    const n = rand(2, 10) * 2;
    const answer = n / 2;
    return formatQuestion(
      `${n} ning yarmi nechta?`,
      answer,
      makeOptions(answer, 4, 5)
    );
  } else if (difficulty === 2) {
    // What is quarter of N?
    const n = rand(2, 6) * 4;
    const answer = n / 4;
    return formatQuestion(
      `${n} ning choragi nechta?`,
      answer,
      makeOptions(answer, 4, 4)
    );
  } else {
    // Mixed: half or quarter
    const isHalf = Math.random() > 0.5;
    if (isHalf) {
      const n = rand(5, 25) * 2;
      const answer = n / 2;
      return formatQuestion(
        `${n} ning yarmi nechta?`,
        answer,
        makeOptions(answer, 4, 8)
      );
    }
    const n = rand(3, 12) * 4;
    const answer = n / 4;
    return formatQuestion(
      `${n} ning choragi nechta?`,
      answer,
      makeOptions(answer, 4, 6)
    );
  }
}

module.exports = {
  additionWithin100,
  subtractionWithin100,
  comparisonWithin100,
  multiplicationIntro,
  divisionIntro,
  expressionsGrade2,
  fractionsIntroGrade2
};
