// ═══════════════════════════════════════════
//  Balloon Pop Math — Game Engine
//  Pure vanilla JS, no dependencies
// ═══════════════════════════════════════════

(function () {
  "use strict";

  // ─── Parse URL params ───
  const params = new URLSearchParams(window.location.search);
  const grade = params.get("grade") || "2";
  const topic = params.get("topic") || "addition_100";
  const difficulty = parseInt(params.get("difficulty")) || 1;
  const topicName = params.get("topicName") || "";

  document.getElementById("headerTitle").textContent = topicName || "Sharlar o'yini";
  document.getElementById("headerSub").textContent = `${grade}-sinf | Sharlar o'yini`;
  document.getElementById("backToTopics").href = `topics.html?grade=${grade}`;

  // ─── Constants ───
  const TOTAL_QUESTIONS = 10;
  const ROUND_TIME = 8;          // seconds per question before balloons fly away
  const BALLOON_FLOAT_SEC = 8;   // CSS animation duration
  const POINTS_CORRECT = 10;
  const POINTS_WRONG = -5;
  const STREAK_CELEBRATION = 5;

  // Balloon color palettes: [fill, knot, glow]
  const COLORS = [
    { fill: "#ef4444", knot: "#dc2626" },   // red
    { fill: "#3b82f6", knot: "#2563eb" },   // blue
    { fill: "#10b981", knot: "#059669" },   // green
    { fill: "#f59e0b", knot: "#d97706" },   // amber
    { fill: "#8b5cf6", knot: "#7c3aed" },   // violet
    { fill: "#ec4899", knot: "#db2777" },   // pink
    { fill: "#06b6d4", knot: "#0891b2" },   // cyan
    { fill: "#f97316", knot: "#ea580c" },   // orange
  ];

  // ─── State ───
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let currentQ = 0;
  let streak = 0;
  let answered = false;
  let roundTimer = null;
  let questionData = null;
  let activeBalloons = [];

  // ─── DOM refs ───
  const arena = document.getElementById("arena");
  const questionText = document.getElementById("questionText");
  const scoreDisplay = document.getElementById("scoreDisplay");
  const questionNum = document.getElementById("questionNum");
  const streakWrap = document.getElementById("streakWrap");
  const streakNum = document.getElementById("streakNum");
  const timerBar = document.getElementById("timerBar");

  // ─── Audio (simple oscillator beeps — no files needed) ───
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function ensureAudio() {
    if (!audioCtx) {
      try { audioCtx = new AudioCtx(); } catch (_) { /* silent fallback */ }
    }
  }

  function beep(freq, duration, type) {
    ensureAudio();
    if (!audioCtx) return;
    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = type || "sine";
      osc.frequency.value = freq;
      gain.gain.value = 0.12;
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (_) {}
  }

  function sfxPop() { beep(800, 0.08, "square"); setTimeout(() => beep(1200, 0.06, "sine"), 40); }
  function sfxWrong() { beep(200, 0.15, "sawtooth"); setTimeout(() => beep(150, 0.2, "sawtooth"), 100); }
  function sfxStreak() { beep(523, 0.1, "sine"); setTimeout(() => beep(659, 0.1, "sine"), 80); setTimeout(() => beep(784, 0.15, "sine"), 160); }

  // ─── Init clouds ───
  function createClouds() {
    const sky = document.getElementById("skyBg");
    for (let i = 0; i < 6; i++) {
      const c = document.createElement("div");
      c.className = "cloud";
      const w = rand(80, 160);
      const h = w * 0.4;
      Object.assign(c.style, {
        width: w + "px", height: h + "px",
        top: rand(5, 35) + "%",
        left: rand(-5, 95) + "%",
        opacity: (0.35 + Math.random() * 0.35).toFixed(2)
      });
      sky.appendChild(c);
    }
  }
  createClouds();

  // ─── Helpers ───
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

  // ─── Fetch question from existing API ───
  async function fetchQuestion() {
    const url = `/api/generate?grade=${grade}&topic=${topic}&difficulty=${difficulty}`;
    const res = await fetch(url);
    return res.json();
  }

  // ─── Create a single balloon DOM element ───
  function createBalloonEl(value, color, x, delay) {
    const sway = rand(-15, 15) + "deg";
    const dur = (BALLOON_FLOAT_SEC + rand(-1, 1)) + "s";

    const wrap = document.createElement("div");
    wrap.className = "balloon-wrap";
    wrap.style.left = x + "%";
    wrap.style.setProperty("--duration", dur);
    wrap.style.setProperty("--sway", sway);
    wrap.dataset.value = String(value);

    const balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.background = `radial-gradient(circle at 35% 30%, ${lighten(color.fill, 40)}, ${color.fill} 70%, ${darken(color.fill, 20)})`;
    balloon.style.setProperty("--knot-color", color.knot);

    const label = document.createElement("span");
    label.className = "balloon-label";
    label.textContent = String(value);

    const string = document.createElement("div");
    string.className = "balloon-string";

    balloon.appendChild(label);
    wrap.appendChild(balloon);
    wrap.appendChild(string);

    wrap.addEventListener("click", (e) => {
      e.stopPropagation();
      handleBalloonClick(wrap, value);
    });

    // Start floating after delay
    setTimeout(() => {
      wrap.classList.add("floating");
    }, delay);

    return wrap;
  }

  // ─── Balloon click handler ───
  function handleBalloonClick(wrap, value) {
    if (answered) return;
    answered = true;
    clearTimeout(roundTimer);

    const isCorrect = String(value) === String(questionData.answer);

    if (isCorrect) {
      // POP! ✅
      sfxPop();
      score += POINTS_CORRECT;
      correctCount++;
      streak++;

      wrap.classList.add("popping");
      spawnParticles(wrap);
      showScoreFloat(wrap, `+${POINTS_CORRECT}`, "text-emerald-500");

      // Check streak celebration
      if (streak > 0 && streak % STREAK_CELEBRATION === 0) {
        setTimeout(() => {
          sfxStreak();
          showStreakBanner(streak);
          launchConfetti();
        }, 300);
      }
    } else {
      // WRONG 🙁
      sfxWrong();
      score = Math.max(0, score + POINTS_WRONG);
      wrongCount++;
      streak = 0;

      wrap.classList.add("shaking");
      showScoreFloat(wrap, String(POINTS_WRONG), "text-rose-500");

      // Reveal correct balloon
      activeBalloons.forEach((b) => {
        if (String(b.dataset.value) === String(questionData.answer)) {
          b.querySelector(".balloon").style.boxShadow = "0 0 0 4px #10b981, 0 0 20px rgba(16,185,129,0.5)";
          b.querySelector(".balloon-label").style.fontSize = "28px";
        }
      });
    }

    updateHUD();

    // Next question after delay
    setTimeout(() => {
      clearArena();
      if (currentQ >= TOTAL_QUESTIONS) {
        showResult();
      } else {
        loadQuestion();
      }
    }, isCorrect ? 800 : 1500);
  }

  // ─── Time-out: balloons floated away ───
  function handleTimeout() {
    if (answered) return;
    answered = true;
    wrongCount++;
    streak = 0;
    updateHUD();

    // Flash question red
    document.getElementById("questionBanner").classList.add("ring-2", "ring-rose-400");
    setTimeout(() => {
      document.getElementById("questionBanner").classList.remove("ring-2", "ring-rose-400");
      clearArena();
      if (currentQ >= TOTAL_QUESTIONS) {
        showResult();
      } else {
        loadQuestion();
      }
    }, 1000);
  }

  // ─── Load question ───
  async function loadQuestion() {
    answered = false;
    currentQ++;
    questionNum.textContent = `${currentQ}/${TOTAL_QUESTIONS}`;
    updateStreakUI();

    // Reset timer bar
    timerBar.style.transition = "none";
    timerBar.style.width = "100%";
    timerBar.className = "h-full bg-indigo-500 rounded-r-full";
    void timerBar.offsetWidth; // force reflow
    timerBar.style.transition = `width ${ROUND_TIME}s linear`;

    questionData = await fetchQuestion();

    // Display question
    questionText.textContent = questionData.question;

    // Animate timer countdown
    requestAnimationFrame(() => {
      timerBar.style.width = "0%";
    });
    // Change color at half-way
    setTimeout(() => {
      if (!answered) timerBar.className = "h-full bg-amber-400 rounded-r-full";
    }, (ROUND_TIME * 0.55) * 1000);
    setTimeout(() => {
      if (!answered) timerBar.className = "h-full bg-rose-500 rounded-r-full";
    }, (ROUND_TIME * 0.8) * 1000);

    // Spawn balloons
    spawnBalloons(questionData.options);

    // Round timeout
    roundTimer = setTimeout(handleTimeout, ROUND_TIME * 1000);
  }

  // ─── Spawn balloon set ───
  function spawnBalloons(options) {
    activeBalloons = [];
    const colorPick = shuffle([...COLORS]).slice(0, options.length);

    // Distribute horizontally with good spacing
    const count = options.length;
    const minGap = 22;
    const positions = [];
    for (let i = 0; i < count; i++) {
      let x;
      let attempts = 0;
      do {
        x = rand(8, 80);
        attempts++;
      } while (
        positions.some((px) => Math.abs(px - x) < minGap) && attempts < 30
      );
      positions.push(x);
    }

    options.forEach((val, i) => {
      const delay = rand(0, 600);
      const el = createBalloonEl(val, colorPick[i], positions[i], delay);
      arena.appendChild(el);
      activeBalloons.push(el);
    });
  }

  // ─── Clear arena ───
  function clearArena() {
    arena.innerHTML = "";
    activeBalloons = [];
  }

  // ─── Pop particles ───
  function spawnParticles(wrap) {
    const rect = wrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const color = wrap.querySelector(".balloon").style.background;

    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "pop-particle";
      const size = rand(6, 14);
      const angle = (Math.PI * 2 * i) / 12;
      const dist = rand(40, 90);
      p.style.width = size + "px";
      p.style.height = size + "px";
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.background = COLORS[rand(0, COLORS.length - 1)].fill;
      p.style.setProperty("--px", Math.cos(angle) * dist + "px");
      p.style.setProperty("--py", Math.sin(angle) * dist + "px");
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 600);
    }
  }

  // ─── Score float ───
  function showScoreFloat(wrap, text, colorClass) {
    const rect = wrap.getBoundingClientRect();
    const el = document.createElement("div");
    el.className = `score-float font-extrabold text-2xl ${colorClass}`;
    el.textContent = text;
    el.style.left = rect.left + rect.width / 2 - 20 + "px";
    el.style.top = rect.top - 10 + "px";
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  // ─── Streak UI ───
  function updateStreakUI() {
    if (streak >= 2) {
      streakWrap.classList.remove("hidden");
      streakNum.textContent = streak;
    } else {
      streakWrap.classList.add("hidden");
    }
  }

  function showStreakBanner(n) {
    const banner = document.createElement("div");
    banner.className = "streak-banner fixed top-1/3 left-1/2 -translate-x-1/2 z-[100] bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-2xl px-8 py-4 shadow-2xl text-center";
    banner.innerHTML = `<div class="text-4xl mb-1">&#128293; ${n} ketma-ket!</div><div class="text-lg font-bold">Ajoyib davom eting!</div>`;
    document.body.appendChild(banner);
    setTimeout(() => {
      banner.style.transition = "opacity 0.4s";
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 500);
    }, 1800);
  }

  // ─── Confetti ───
  function launchConfetti() {
    const confettiColors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];
    for (let i = 0; i < 60; i++) {
      const c = document.createElement("div");
      c.className = "confetti-piece";
      c.style.left = rand(0, 100) + "vw";
      c.style.background = confettiColors[rand(0, confettiColors.length - 1)];
      c.style.width = rand(6, 12) + "px";
      c.style.height = rand(10, 18) + "px";
      c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      c.style.setProperty("--fall-dur", (rand(18, 35) / 10) + "s");
      c.style.setProperty("--rz", rand(200, 800) + "deg");
      c.style.setProperty("--rx", rand(100, 500) + "deg");
      c.style.animationDelay = rand(0, 400) + "ms";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 4000);
    }
  }

  // ─── HUD update ───
  function updateHUD() {
    scoreDisplay.textContent = score;
    updateStreakUI();
  }

  // ─── Result ───
  function showResult() {
    clearArena();
    const total = correctCount + wrongCount;
    const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    document.getElementById("finalScore").textContent = score;
    document.getElementById("correctCount").textContent = correctCount;
    document.getElementById("wrongCount").textContent = wrongCount;

    let emoji, title, sub;
    if (pct >= 90) {
      emoji = "\uD83C\uDFC6"; title = "Ajoyib!"; sub = "Siz haqiqiy chempionsiz!";
    } else if (pct >= 70) {
      emoji = "\uD83C\uDF1F"; title = "Yaxshi!"; sub = "Juda yaxshi natija!";
    } else if (pct >= 50) {
      emoji = "\uD83D\uDCAA"; title = "Yomon emas!"; sub = "Mashq qiling, yaxshilanasiz!";
    } else {
      emoji = "\uD83D\uDCDA"; title = "Mashq kerak!"; sub = "Ko'proq mashq qiling!";
    }

    document.getElementById("resultEmoji").textContent = emoji;
    document.getElementById("resultTitle").textContent = title;
    document.getElementById("resultSub").textContent = sub;

    document.getElementById("resultOverlay").classList.remove("hidden");
    setTimeout(() => {
      document.getElementById("resultBar").style.width = pct + "%";
    }, 300);

    if (pct >= 80) launchConfetti();
  }

  // ─── Restart ───
  window.restartGame = function () {
    score = 0; correctCount = 0; wrongCount = 0; currentQ = 0; streak = 0;
    answered = false;
    scoreDisplay.textContent = "0";
    document.getElementById("resultOverlay").classList.add("hidden");
    clearArena();
    loadQuestion();
  };

  // ─── Color utils ───
  function lighten(hex, pct) {
    return adjustColor(hex, pct);
  }
  function darken(hex, pct) {
    return adjustColor(hex, -pct);
  }
  function adjustColor(hex, pct) {
    hex = hex.replace("#", "");
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    r = Math.min(255, Math.max(0, r + Math.round(r * pct / 100)));
    g = Math.min(255, Math.max(0, g + Math.round(g * pct / 100)));
    b = Math.min(255, Math.max(0, b + Math.round(b * pct / 100)));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }

  // ─── Start ───
  loadQuestion();

})();
