// ════════════════════════════════════════════════════
//  UzMath Mini — Supabase Client + Auth + DB Helpers
// ════════════════════════════════════════════════════

// ══ KONFIGURATSIYA ══
// Supabase Dashboard → Settings → API dan oling
const SUPABASE_URL = 'https://ijlzxkwfrzsqjerbuvcp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlqbHp4a3dmcnpzcWplcmJ1dmNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxMTI1NDgsImV4cCI6MjA5MDY4ODU0OH0.6WMUAX45Ve2RB-wIKKXmrSho_p1Zy99Ib0L6WRTVixg';

// ══ CLIENT INIT ══
const _sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ════════════════════════════════════════
//  AUTH HELPERS
// ════════════════════════════════════════

/** Username ni fake email ga aylantirish (Supabase ichki talab) */
function usernameToEmail(username) {
  return `${username.toLowerCase().trim()}@uzmath.uz`;
}

/** Ro'yxatdan o'tish (username + parol) */
async function signUp(username, password, firstName, lastName, grade, isTeacher = false) {
  const email = usernameToEmail(username);
  const { data, error } = await _sb.auth.signUp({ email, password });
  if (error) throw error;

  if (!data.session) {
    throw new Error("Session yo'q. Qayta urinib ko'ring.");
  }

  const { error: profErr } = await _sb.from('profiles').insert({
    id: data.user.id,
    first_name: firstName,
    last_name: lastName,
    grade: grade,
    username: username.toLowerCase().trim(),
    role: isTeacher ? 'pending_teacher' : 'student'
  });

  if (profErr) throw profErr;

  return data;
}

/** Kirish (username + parol) */
async function signIn(username, password) {
  const email = usernameToEmail(username);
  const { data, error } = await _sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** Chiqish */
async function signOut() {
  const { error } = await _sb.auth.signOut();
  if (error) throw error;
  window.location.href = '/auth.html';
}

/** Joriy sessiyani olish */
async function getSession() {
  const { data: { session } } = await _sb.auth.getSession();
  return session;
}

/** Joriy foydalanuvchi profilini olish */
async function getProfile() {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await _sb
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) return null;
  return data;
}

/** Auth guard — login qilinmagan bo'lsa auth.html ga yo'naltirish */
async function requireAuth() {
  const session = await getSession();
  if (!session) {
    window.location.href = '/auth.html';
    return null;
  }
  const profile = await getProfile();
  if (!profile) {
    window.location.href = '/auth.html';
    return null;
  }
  return profile;
}

/** Auth sahifasi uchun — agar login bo'lsa index.html ga */
async function redirectIfLoggedIn() {
  const session = await getSession();
  if (session) {
    const profile = await getProfile();
    if (profile) {
      if (profile.role === 'admin') {
        window.location.href = '/admin.html';
      } else if (profile.role === 'teacher') {
        window.location.href = '/teacher.html';
      } else {
        window.location.href = '/index.html';
      }
      return true;
    }
  }
  return false;
}

// ════════════════════════════════════════
//  GAME SESSION HELPERS
// ════════════════════════════════════════

/** O'yin natijasini saqlash */
async function saveGameSession({
  userId, grade, topicId, topicName, mode, difficulty,
  problemsSolved, correctCount, wrongCount, score,
  diamonds, goldCoins, isVacation, quarter, academicYear
}) {
  const { data, error } = await _sb.from('game_sessions').insert({
    user_id: userId,
    grade,
    topic_id: topicId,
    topic_name: topicName,
    mode,
    difficulty,
    problems_solved: problemsSolved,
    correct_count: correctCount,
    wrong_count: wrongCount,
    score,
    diamonds,
    gold_coins: goldCoins,
    is_vacation: isVacation,
    quarter,
    academic_year: academicYear
  });
  if (error) throw error;
  return data;
}

/** Bugungi yechilgan masalalar sonini olish */
async function getTodayProblemsCount(userId) {
  const today = getTashkentDate();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await _sb
    .from('game_sessions')
    .select('problems_solved')
    .eq('user_id', userId)
    .gte('played_at', startOfDay.toISOString())
    .lte('played_at', endOfDay.toISOString());

  if (error) return 0;
  return data.reduce((sum, s) => sum + s.problems_solved, 0);
}

/** Joriy chorak statistikasini olish */
async function getQuarterStats(userId, quarter, academicYear) {
  const { data, error } = await _sb
    .from('game_sessions')
    .select('score, diamonds, gold_coins, problems_solved, correct_count, wrong_count, is_vacation')
    .eq('user_id', userId)
    .eq('quarter', quarter)
    .eq('academic_year', academicYear);

  if (error) return { score: 0, diamonds: 0, goldCoins: 0, problems: 0, correct: 0, wrong: 0 };

  const quarterData = data.filter(s => !s.is_vacation);
  const vacationData = data.filter(s => s.is_vacation);

  return {
    score: quarterData.reduce((s, r) => s + r.score, 0),
    diamonds: quarterData.reduce((s, r) => s + r.diamonds, 0),
    goldCoins: vacationData.reduce((s, r) => s + r.gold_coins, 0),
    problemsSolved: data.reduce((s, r) => s + r.problems_solved, 0),
    correct: data.reduce((s, r) => s + r.correct_count, 0),
    wrong: data.reduce((s, r) => s + r.wrong_count, 0)
  };
}

/** Yillik oltin tangalar */
async function getYearlyGoldCoins(userId, academicYear) {
  const { data, error } = await _sb
    .from('game_sessions')
    .select('gold_coins')
    .eq('user_id', userId)
    .eq('academic_year', academicYear)
    .eq('is_vacation', true);

  if (error) return 0;
  return data.reduce((s, r) => s + r.gold_coins, 0);
}

/** Bugungi batafsil statistika (to'g'ri/noto'g'ri) */
async function getTodayStats(userId) {
  const today = getTashkentDate();
  const startOfDay = new Date(today);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(today);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await _sb
    .from('game_sessions')
    .select('correct_count, wrong_count')
    .eq('user_id', userId)
    .gte('played_at', startOfDay.toISOString())
    .lte('played_at', endOfDay.toISOString());

  if (error) return { correct: 0, wrong: 0 };
  return {
    correct: data.reduce((s, r) => s + r.correct_count, 0),
    wrong: data.reduce((s, r) => s + r.wrong_count, 0)
  };
}

/** O'yin tarixini olish (oxirgi N ta) */
async function getGameHistory(userId, limit = 50) {
  const { data, error } = await _sb
    .from('game_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data;
}

// ════════════════════════════════════════
//  LEADERBOARD HELPERS
// ════════════════════════════════════════

/** Sinf bo'yicha leaderboard */
async function getLeaderboard(grade, quarter, academicYear) {
  const { data, error } = await _sb
    .from('game_sessions')
    .select(`
      user_id,
      profiles!inner(first_name, last_name, grade)
    `)
    .eq('profiles.grade', grade)
    .eq('quarter', quarter)
    .eq('academic_year', academicYear)
    .eq('is_vacation', false);

  if (error) return [];

  // Aggregate by user
  const map = {};
  data.forEach(row => {
    const uid = row.user_id;
    if (!map[uid]) {
      map[uid] = {
        user_id: uid,
        first_name: row.profiles.first_name,
        last_name: row.profiles.last_name,
        total_score: 0,
        total_diamonds: 0,
        total_problems: 0
      };
    }
  });

  // Need separate query for aggregation
  const { data: sessions, error: sErr } = await _sb
    .from('game_sessions')
    .select('user_id, score, diamonds, problems_solved')
    .eq('quarter', quarter)
    .eq('academic_year', academicYear)
    .eq('is_vacation', false)
    .in('user_id', Object.keys(map));

  if (!sErr) {
    sessions.forEach(s => {
      if (map[s.user_id]) {
        map[s.user_id].total_score += s.score;
        map[s.user_id].total_diamonds += s.diamonds;
        map[s.user_id].total_problems += s.problems_solved;
      }
    });
  }

  return Object.values(map)
    .sort((a, b) => b.total_diamonds - a.total_diamonds)
    .slice(0, 50);
}

// ════════════════════════════════════════
//  TEACHER HELPERS
// ════════════════════════════════════════

/** Barcha o'quvchilarni olish (faqat teacher uchun) */
async function getAllStudents(gradeFilter = null) {
  let query = _sb
    .from('profiles')
    .select('*')
    .eq('role', 'student')
    .order('grade')
    .order('last_name');

  if (gradeFilter) {
    query = query.eq('grade', gradeFilter);
  }

  const { data, error } = await query;
  if (error) return [];
  return data;
}

/** O'quvchi statistikasi (teacher uchun) */
async function getStudentStats(userId) {
  const { data, error } = await _sb
    .from('game_sessions')
    .select('*')
    .eq('user_id', userId)
    .order('played_at', { ascending: false });

  if (error) return [];
  return data;
}

// ════════════════════════════════════════
//  ADMIN HELPERS
// ════════════════════════════════════════

/** Tasdiqlash kutayotgan o'qituvchilar */
async function getPendingTeachers() {
  const { data, error } = await _sb
    .from('profiles')
    .select('*')
    .eq('role', 'pending_teacher')
    .order('last_name');
  if (error) return [];
  return data;
}

/** Barcha tasdiqlangan o'qituvchilar */
async function getAllTeachers() {
  const { data, error } = await _sb
    .from('profiles')
    .select('*')
    .eq('role', 'teacher')
    .order('last_name');
  if (error) return [];
  return data;
}

/** O'qituvchini tasdiqlash */
async function approveTeacher(userId) {
  const { error } = await _sb
    .from('profiles')
    .update({ role: 'teacher' })
    .eq('id', userId);
  if (error) throw error;
}

/** O'qituvchi so'rovini rad etish (student ga qaytarish) */
async function rejectTeacher(userId) {
  const { error } = await _sb
    .from('profiles')
    .update({ role: 'student' })
    .eq('id', userId);
  if (error) throw error;
}

// ════════════════════════════════════════
//  BOOKS / KUTUBXONA HELPERS
// ════════════════════════════════════════

/** Kitoblar ro'yxatini olish */
async function getBooks(gradeFilter = null) {
  let query = _sb
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (gradeFilter) {
    query = query.eq('grade', gradeFilter);
  }

  const { data, error } = await query;
  if (error) return [];
  return data;
}

/** Kitob qo'shish (teacher) */
async function addBook({ title, description, grade, fileUrl, fileKey, fileSize, pageCount, uploadedBy }) {
  const { data, error } = await _sb.from('books').insert({
    title,
    description,
    grade,
    file_url: fileUrl,
    file_key: fileKey,
    file_size: fileSize,
    page_count: pageCount,
    uploaded_by: uploadedBy
  });
  if (error) throw error;
  return data;
}

/** Kitob o'chirish (teacher) */
async function deleteBook(bookId) {
  const { error } = await _sb.from('books').delete().eq('id', bookId);
  if (error) throw error;
}

// ════════════════════════════════════════
//  UTILITY
// ════════════════════════════════════════

/** Toshkent vaqtida bugungi sanani olish */
function getTashkentDate() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 5 * 3600000); // UTC+5
}

/** Formatlangan sana */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('uz-UZ', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
}

/** Sonni formatlash (1000 → 1,000) */
function formatNumber(n) {
  return n.toLocaleString('uz-UZ');
}
