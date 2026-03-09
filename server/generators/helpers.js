// Shared helper utilities for question generators

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Generate wrong options that are plausible (near the correct answer)
function makeOptions(correct, count = 4, spread = null) {
  const opts = new Set([correct]);
  const s = spread || Math.max(3, Math.ceil(Math.abs(correct) * 0.3));

  let attempts = 0;
  while (opts.size < count && attempts < 100) {
    let wrong = correct + rand(-s, s);
    if (wrong !== correct && wrong >= 0) {
      opts.add(wrong);
    }
    attempts++;
  }
  // Fallback if we couldn't generate enough unique options
  let fallback = 1;
  while (opts.size < count) {
    opts.add(correct + fallback);
    fallback++;
  }

  return shuffle([...opts]);
}

function formatQuestion(question, answer, options, type = "mcq") {
  return {
    question,
    answer,
    options: options || makeOptions(answer),
    type
  };
}

module.exports = { rand, shuffle, makeOptions, formatQuestion };
