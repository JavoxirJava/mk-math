// Curriculum data extracted from official Uzbekistan math textbooks
// Grade 2: "Matematika 2-sinf" (2021 edition)
// Grade 3: "Matematika 3-sinf" by Burxonov et al. (2019 edition)
// Grade 4: "Matematika 4-sinf" by Bikbayeva, Girfanova (2020 edition)

const curriculum = {
  2: {
    label: "2-sinf",
    topics: [
      {
        id: "addition_100",
        name: "100 ichida qo'shish",
        nameRu: "Сложение в пределах 100",
        description: "100 ichida sonlarni qo'shish",
        generator: "additionWithin100"
      },
      {
        id: "subtraction_100",
        name: "100 ichida ayirish",
        nameRu: "Вычитание в пределах 100",
        description: "100 ichida sonlarni ayirish",
        generator: "subtractionWithin100"
      },
      {
        id: "comparison",
        name: "Sonlarni taqqoslash",
        nameRu: "Сравнение чисел",
        description: "Sonlarni >, <, = belgilari bilan taqqoslash",
        generator: "comparisonWithin100"
      },
      {
        id: "multiplication_intro",
        name: "Ko'paytirishga kirish",
        nameRu: "Введение в умножение",
        description: "Teng guruhlarni qo'shish orqali ko'paytirish",
        generator: "multiplicationIntro"
      },
      {
        id: "division_intro",
        name: "Bo'lishga kirish",
        nameRu: "Введение в деление",
        description: "Teng guruhlarga bo'lish asoslari",
        generator: "divisionIntro"
      },
      {
        id: "expressions",
        name: "Sonli ifodalar",
        nameRu: "Числовые выражения",
        description: "Sonli va harfli ifodalar, tenglamalar",
        generator: "expressionsGrade2"
      },
      {
        id: "fractions_intro",
        name: "Butunning bo'laklari",
        nameRu: "Доли целого",
        description: "Yarim, chorak, butunning bo'laklari",
        generator: "fractionsIntroGrade2"
      }
    ]
  },
  3: {
    label: "3-sinf",
    topics: [
      {
        id: "multiply_divide_table",
        name: "Ko'paytirish va bo'lish jadvali",
        nameRu: "Таблица умножения и деления",
        description: "Jadvaldan tashqari ko'paytirish va bo'lish",
        generator: "multiplyDivideTable"
      },
      {
        id: "multiply_written",
        name: "Yozma ko'paytirish",
        nameRu: "Письменное умножение",
        description: "1000 ichida yozma ko'paytirish",
        generator: "writtenMultiplication"
      },
      {
        id: "division_written",
        name: "Yozma bo'lish",
        nameRu: "Письменное деление",
        description: "1000 ichida yozma bo'lish, qoldiqli bo'lish",
        generator: "writtenDivision"
      },
      {
        id: "four_digit_numbers",
        name: "To'rt xonali sonlar",
        nameRu: "Четырёхзначные числа",
        description: "10 000 ichida raqamlash, qo'shish va ayirish",
        generator: "fourDigitNumbers"
      },
      {
        id: "fractions_basic",
        name: "Oddiy kasrlar",
        nameRu: "Простые дроби",
        description: "Kasr tushunchasi, maxraji 2,3,4,6,8 bo'lgan kasrlar",
        generator: "fractionsBasic"
      },
      {
        id: "perimeter",
        name: "Perimetr",
        nameRu: "Периметр",
        description: "To'g'ri to'rtburchak va kvadrat perimetri",
        generator: "perimeterGrade3"
      },
      {
        id: "comparison_1000",
        name: "Sonlarni taqqoslash (1000)",
        nameRu: "Сравнение чисел (1000)",
        description: "1000 ichida sonlarni taqqoslash",
        generator: "comparisonWithin1000"
      },
      {
        id: "area_intro",
        name: "Yuz o'lchovi",
        nameRu: "Площадь",
        description: "Yuzalarni taqqoslash, yuz o'lchov birliklari",
        generator: "areaIntroGrade3"
      }
    ]
  },
  4: {
    label: "4-sinf",
    topics: [
      {
        id: "million_numeration",
        name: "Million ichida raqamlash",
        nameRu: "Нумерация до миллиона",
        description: "1 dan 1 000 000 gacha sonlarni raqamlash va taqqoslash",
        generator: "millionNumeration"
      },
      {
        id: "million_add_sub",
        name: "Qo'shish va ayirish",
        nameRu: "Сложение и вычитание",
        description: "Million ichida qo'shish va ayirish amallari",
        generator: "millionAddSub"
      },
      {
        id: "million_multiply_divide",
        name: "Ko'paytirish va bo'lish",
        nameRu: "Умножение и деление",
        description: "Ko'p xonali sonlarni ko'paytirish va bo'lish",
        generator: "millionMultiplyDivide"
      },
      {
        id: "equations",
        name: "Tenglamalar",
        nameRu: "Уравнения",
        description: "Tenglamalarni yechish",
        generator: "equationsGrade4"
      },
      {
        id: "fractions_grade4",
        name: "Kasrlar",
        nameRu: "Дроби",
        description: "Oddiy kasrlar, o'nli kasrlar, kasrlarni taqqoslash",
        generator: "fractionsGrade4"
      },
      {
        id: "average",
        name: "O'rta arifmetik",
        nameRu: "Среднее арифметическое",
        description: "O'rta arifmetikni topish",
        generator: "averageGrade4"
      },
      {
        id: "area_perimeter",
        name: "Yuza va perimetr",
        nameRu: "Площадь и периметр",
        description: "To'g'ri to'rtburchak va kvadrat yuzi va perimetri",
        generator: "areaPerimeterGrade4"
      },
      {
        id: "speed_distance",
        name: "Harakat masalalari",
        nameRu: "Задачи на движение",
        description: "Tezlik, vaqt, masofa masalalari",
        generator: "speedDistanceGrade4"
      }
    ]
  }
};

module.exports = curriculum;
