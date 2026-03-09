const { Router } = require("express");
const curriculum = require("../data/curriculum");
const grade2 = require("../generators/grade2");
const grade3 = require("../generators/grade3");
const grade4 = require("../generators/grade4");

const router = Router();

const generators = { 2: grade2, 3: grade3, 4: grade4 };

// GET /api/generate?grade=3&topic=multiply_divide_table&difficulty=2&count=1
router.get("/", (req, res) => {
  const grade = parseInt(req.query.grade);
  const topicId = req.query.topic;
  const difficulty = Math.min(3, Math.max(1, parseInt(req.query.difficulty) || 1));
  const count = Math.min(20, Math.max(1, parseInt(req.query.count) || 1));

  if (!curriculum[grade]) {
    return res.status(400).json({ error: "Noto'g'ri sinf." });
  }

  const topicInfo = curriculum[grade].topics.find((t) => t.id === topicId);
  if (!topicInfo) {
    return res.status(400).json({ error: "Mavzu topilmadi." });
  }

  const genModule = generators[grade];
  const genFn = genModule[topicInfo.generator];
  if (!genFn) {
    return res.status(500).json({ error: "Generator topilmadi." });
  }

  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(genFn(difficulty));
  }

  if (count === 1) {
    return res.json(questions[0]);
  }
  res.json({ questions });
});

module.exports = router;
