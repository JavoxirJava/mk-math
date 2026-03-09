const curriculum = require("../../server/data/curriculum");
const grade2 = require("../../server/generators/grade2");
const grade3 = require("../../server/generators/grade3");
const grade4 = require("../../server/generators/grade4");

const generators = { 2: grade2, 3: grade3, 4: grade4 };

exports.handler = async (event) => {
  const params = event.queryStringParameters || {};
  const grade = parseInt(params.grade);
  const topicId = params.topic;
  const difficulty = Math.min(3, Math.max(1, parseInt(params.difficulty) || 1));
  const count = Math.min(20, Math.max(1, parseInt(params.count) || 1));

  if (!curriculum[grade]) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Noto'g'ri sinf." })
    };
  }

  const topicInfo = curriculum[grade].topics.find((t) => t.id === topicId);
  if (!topicInfo) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Mavzu topilmadi." })
    };
  }

  const genModule = generators[grade];
  const genFn = genModule[topicInfo.generator];
  if (!genFn) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Generator topilmadi." })
    };
  }

  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push(genFn(difficulty));
  }

  if (count === 1) {
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(questions[0])
    };
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questions })
  };
};
