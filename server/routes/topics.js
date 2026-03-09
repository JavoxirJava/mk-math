const { Router } = require("express");
const curriculum = require("../data/curriculum");

const router = Router();

// GET /api/topics?grade=2
router.get("/", (req, res) => {
  const grade = parseInt(req.query.grade);

  if (!curriculum[grade]) {
    return res.status(400).json({ error: "Noto'g'ri sinf. 2, 3 yoki 4 tanlang." });
  }

  const gradeData = curriculum[grade];
  const topics = gradeData.topics.map(({ id, name, nameRu, description }) => ({
    id,
    name,
    nameRu,
    description
  }));

  res.json({ grade, label: gradeData.label, topics });
});

module.exports = router;
