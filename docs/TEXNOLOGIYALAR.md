# UzMath Mini — Texnologiyalar va Bajarilgan Ishlar

> O'zbekiston boshlang'ich sinf o'quvchilari (2–4-sinf) uchun interaktiv matematika o'yini platformasi.

---

## Mundarija

1. [Loyiha Arxitekturasi](#1-loyiha-arxitekturasi)
2. [Frontend Texnologiyalar](#2-frontend-texnologiyalar)
3. [Backend Texnologiyalar](#3-backend-texnologiyalar)
4. [Ma'lumotlar Bazasi va Xotira](#4-malumotlar-bazasi-va-xotira)
5. [Fayl Saqlash](#5-fayl-saqlash)
6. [Deploy va Hosting](#6-deploy-va-hosting)
7. [Bajarilgan Ishlar](#7-bajarilgan-ishlar)
8. [Papka Tuzilmasi](#8-papka-tuzilmasi)

---

## 1. Loyiha Arxitekturasi

```
┌─────────────────────────────────────────┐
│          Foydalanuvchi Brauzeri          │
│   HTML + Tailwind CSS + Vanilla JS      │
│   Supabase JS SDK (CDN orqali)          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│        Netlify (Hosting + Functions)    │
│   /public  → statik fayllar            │
│   /.netlify/functions/ → serverless API │
│     • generate.js                       │
│     • topics.js                         │
│     • r2-upload.js                      │
└────────────┬────────────────┬───────────┘
             │                │
             ▼                ▼
    ┌────────────────┐  ┌─────────────────┐
    │   Supabase     │  │  Cloudflare R2  │
    │  PostgreSQL    │  │  (PDF kitoblar) │
    │  Auth + DB     │  │  Object Storage │
    └────────────────┘  └─────────────────┘
```

---

## 2. Frontend Texnologiyalar

### HTML5
**Nima uchun?**
Oddiy, toza va ishlash tezligi yuqori. Framework kerak bo'lmagan yengil loyiha uchun HTML5 yetarli.

**Nima qildi?**
11 ta sahifa: kirish, o'yin, dashboard, liderboard, o'qituvchi paneli, kutubxona va boshqalar.

---

### Tailwind CSS (CDN orqali)
**Nima uchun?**
- O'rnatmasdan CDN orqali ishlatish mumkin — build jarayoni shart emas
- Utility-first yondashuv tufayli tezkor dizayn
- Responsive (mobil va desktop) qurilishga tayyor

**Nima qildi?**
- Barcha sahifalar uchun responsive dizayn
- Rang sxemalari, kartalar, modal oynalar, animatsiyalar
- `sm:`, `md:`, `lg:` breakpointlar bilan mobil-birinchi UI

---

### Vanilla JavaScript (ES6+)
**Nima uchun?**
- React/Vue kabi framework o'rnatishni oldini olish — loyiha kichik va tez yuklansa yetarli
- O'quvchi brauzeri uchun minimal yuklanma
- O'yinlardagi animatsiya va mantiq uchun to'liq nazorat

**Nima qildi?**
- O'yin mexanikasi (savol-javob, hisoblagich, taymer)
- Supabase bilan auth va ma'lumot almashinuvi
- Animatsiyalar va ovozli effektlar

---

### Web Audio API
**Nima uchun?**
Tashqi ovoz fayllarsiz, to'g'ridan-to'g'ri brauzerda signal tovushlar yaratish uchun.

**Nima qildi?**
- To'g'ri javob berganda yuqori ohangdagi beep
- Noto'g'ri javobda pastroq ohangdagi signal
- Balon o'yinida har bir pop uchun ovozli effekt

---

### Google Fonts — Nunito
**Nima uchun?**
Bolalar uchun mo'ljallangan yumaloq va o'qilishi oson shrift.

**Nima qildi?**
Barcha sahifalar uchun asosiy shrift sifatida ishlatiladi.

---

## 3. Backend Texnologiyalar

### Node.js + Express.js
**Nima uchun?**
- JavaScript ekosistemasi — frontend va backend bir tilda
- Engil va tez server
- Lokal ishlab chiqish uchun qulay

**Nima qildi?**
- `/api/topics` — sinfga qarab mavzular ro'yxati
- `/api/generate` — matematik savollar generatsiyasi
- `/api/r2-upload` — Cloudflare R2 uchun presigned URL yaratish
- Statik fayllarni serve qilish (`/public` papka)

---

### Netlify Functions (Serverless)
**Nima uchun?**
- Netlify hosting bilan bepul va to'g'ridan-to'g'ri integratsiya
- Alohida server kerak emas — har bir API endpoint mustaqil funksiya
- Avtomatik deploy — `git push` qilinsa, funksiyalar ham yangilanadi

**Nima qildi?**
`server/routes/` dagi Express route'larning aynan kopiyalari Netlify Functions sifatida qayta yozilgan. Deploy vaqtida Express server emas, shu funksiyalar ishlaydi.

---

### dotenv
**Nima uchun?**
Maxfiy kalitlarni (R2 credentials) kod ichiga yozmaslik, `.env` fayliga saqlash uchun.

**Nima qildi?**
Cloudflare R2 hisob ma'lumotlarini environment variable sifatida yuklab beradi.

---

## 4. Ma'lumotlar Bazasi va Xotira

### Supabase (PostgreSQL + Auth)
**Nima uchun?**
- Bepul tier mavjud, o'rnatish kerak emas
- O'rnatilgan authentication tizimi (email/parol)
- JavaScript SDK to'g'ridan-to'g'ri frontenddan ishlaydi
- Row Level Security (RLS) — har bir foydalanuvchi faqat o'z ma'lumotlarini ko'radi
- Real-time imkoniyatlari liderboard uchun foydali

**Nima qildi?**
- **Auth**: Ro'yxatdan o'tish, kirish, chiqish, sessiya saqlash
- **Profil**: Foydalanuvchi ismi, sinfi, roli (o'quvchi/o'qituvchi)
- **O'yin natijalari**: Har bir o'yindagi to'g'ri/noto'g'ri javoblar, ball
- **Liderboard**: Sinflar bo'yicha reytinglar
- **O'yin tarixi**: Oldingi sessiyalar ro'yxati
- **Kutubxona**: Kitoblar metadata (PDF nomi, sinfi, muallif)

---

## 5. Fayl Saqlash

### Cloudflare R2
**Nima uchun?**
- AWS S3 bilan 100% mos, lekin arzonroq (egress traffic bepul)
- O'qituvchilar PDF kitoblarni yuklashi uchun ishonchli bulutli xotira
- Presigned URL mexanizmi — fayllar faqat ruxsat berilgan vaqtda yuklanadi

**Nima qildi?**
- O'qituvchilar darslik PDF fayllarini R2 ga yuklaydi
- O'quvchilar PDF ni brauzerda ko'radi yoki yuklab oladi
- Presigned URL 15 daqiqa amal qiladi — xavfsizlik uchun

### AWS SDK (`@aws-sdk/client-s3`)
**Nima uchun?**
R2 S3-ga mos interfeys taqdim etadi, shuning uchun AWS rasmiy SDK orqali ishlatish mumkin.

**Nima qildi?**
Presigned URL generatsiyasi (PutObject) — server fayl yuklamasini bevosita qabul qilmaydi, foydalanuvchi to'g'ridan-to'g'ri R2 ga yuklaydi.

---

## 6. Deploy va Hosting

### Netlify
**Nima uchun?**
- `git push` qilinsa, avtomatik deploy
- Bepul SSL sertifikat
- `/public` papkasini statik sayt sifatida serve qiladi
- Netlify Functions bilan serverless backend

**Nima qildi?**
- Barcha HTML sahifalarni hosting qiladi
- API so'rovlarini (`/api/*`) netlify funksiyalarga yo'naltiradi
- `netlify.toml` orqali redirect qoidalari sozlangan

```toml
[[redirects]]
  from = "/api/generate"
  to = "/.netlify/functions/generate"
  status = 200
```

---

## 7. Bajarilgan Ishlar

### O'quv Tizimi
- O'zbekiston rasmiy matematika darsliklari (2–4-sinf) asosida **23 ta mavzu** tuzildi
- Har bir mavzu uchun **3 ta qiyinlik darajasi** (oson, o'rta, qiyin)
- Sinf cheklovlariga rioya qilingan:
  - 2-sinf: max 100 gacha, kasr yo'q
  - 3-sinf: 1000 gacha, jadval ko'paytirish/bo'lish
  - 4-sinf: 1 000 000 gacha, tenglamalar, o'nli kasrlar

### O'yin Rejimlari
| O'yin | Tavsif |
|-------|--------|
| **Asosiy kviz** (game.html) | Ko'p tanlovli savollar, taymer, ball hisoblagich |
| **Balon o'yini** (balloon.html) | Balonni portlatish mexanikasi, streak tizimi |
| **Arqon tortishuv** (tugofwar.html) | Ikki o'yinchi, navbatma-navbat, animatsiyali raqobat |

### Foydalanuvchi Tizimi
- Ro'yxatdan o'tish: ism, foydalanuvchi nomi, sinf, rol (o'quvchi/o'qituvchi)
- Kirish/chiqish, sessiya saqlash
- Profil sahifasi

### Progress Kuzatish
- Kunlik statistika (o'ynalgan savollar, aniqlik foizi)
- Chorak kalendari (4 ta o'quv choragi + ta'til davrlari)
- O'yin tarixi ro'yxati

### Liderboard
- Sinf bo'yicha filtr (2, 3, 4-sinf)
- Top-3 podium ko'rinishi
- Animatsiyali kirish effektlari

### O'qituvchi Paneli
- O'z sinfidagi o'quvchilarni ko'rish
- O'quvchi taraqqiyotini kuzatish
- PDF darsliklarni kutubxonaga yuklash
- Yangi o'qituvchilarni tasdiqlash navbati

### PDF Kutubxona
- Darsliklar sinfga qarab filtrlanadi
- Brauzerda ko'rish yoki yuklab olish
- Cloudflare R2 da xavfsiz saqlash

### Admin Panel
- Foydalanuvchilarni boshqarish
- Tizim sozlamalari

---

## 8. Papka Tuzilmasi

```
mk-math/
├── server/                  # Express backend (lokal ishlab chiqish)
│   ├── app.js               # Asosiy server (port 3000)
│   ├── routes/
│   │   ├── generate.js      # Savol generatsiyasi
│   │   ├── topics.js        # Mavzular ro'yxati
│   │   └── r2-upload.js     # R2 presigned URL
│   ├── data/
│   │   └── curriculum.js    # O'quv dasturi ma'lumotlari
│   └── generators/          # Sinf bo'yicha savol generatorlar
│       ├── grade2.js
│       ├── grade3.js
│       ├── grade4.js
│       └── helpers.js
│
├── public/                  # Statik frontend fayllar
│   ├── index.html           # Bosh sahifa
│   ├── auth.html            # Kirish/ro'yxatdan o'tish
│   ├── game.html            # Asosiy kviz o'yini
│   ├── balloon.html         # Balon o'yini
│   ├── tugofwar.html        # Arqon tortishuv
│   ├── dashboard.html       # O'quvchi dashboardi
│   ├── leaderboard.html     # Reyting jadvali
│   ├── teacher.html         # O'qituvchi paneli
│   ├── admin.html           # Admin boshqaruv
│   ├── library.html         # PDF kutubxona
│   ├── topics.html          # Mavzu tanlash
│   └── js/
│       ├── supabase.js      # Auth va DB yordamchilari
│       ├── balloonGame.js   # Balon o'yini mexanikasi
│       └── quarters.js      # Chorak kalendarini hisoblash
│
├── netlify/
│   └── functions/           # Serverless API (deploy versiyasi)
│       ├── generate.js
│       ├── topics.js
│       └── r2-upload.js
│
├── docs/
│   └── TEXNOLOGIYALAR.md    # Shu hujjat
│
├── netlify.toml             # Netlify konfiguratsiyasi
├── package.json             # NPM paketlar
└── .env                     # Maxfiy kalitlar (gitga qo'shilmaydi)
```

---

## Texnologiyalar Xulosa Jadvali

| Texnologiya | Qayerda | Nima uchun tanlangan |
|-------------|---------|----------------------|
| HTML5 | Frontend | Toza, tez, frameworksiz |
| Tailwind CSS | Frontend | CDN orqali ishlatish, responsive dizayn |
| Vanilla JS | Frontend | Yengil, tez, nazorat to'liq |
| Web Audio API | Frontend | Tashqi fayl kerak emas, brauzerda ovoz |
| Node.js + Express | Backend | Lokal dev server, bir tilda (JS) |
| Netlify Functions | Backend | Serverless deploy, bepul |
| Supabase | DB + Auth | Bepul PostgreSQL + Auth, SDK mavjud |
| Cloudflare R2 | Fayl saqlash | S3-mos, bepul egress |
| AWS SDK | Backend | R2 bilan ishlash uchun |
| Netlify | Hosting | Avtomatik deploy, bepul SSL |
