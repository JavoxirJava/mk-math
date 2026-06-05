/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html",
    "./public/**/*.js",
  ],
  // Runtime'da template-string orqali yasaladigan (skaner ko'rmaydigan) klasslar.
  // Sinf ranglari: emerald/blue/purple/gray, qiyinlik ranglari: emerald/amber/rose.
  safelist: [
    { pattern: /^bg-(emerald|blue|purple|amber|rose|gray)-(50|100)$/ },
    { pattern: /^text-(emerald|blue|purple|amber|rose|gray)-(500|700)$/ },
    { pattern: /^border-(emerald|blue|purple|amber|rose|gray)-400$/, variants: ["hover"] },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Nunito", "sans-serif"],
      },
    },
  },
  plugins: [],
};
