const curriculum = require("../../server/data/curriculum");

exports.handler = async (event) => {
  const grade = parseInt(event.queryStringParameters?.grade);

  if (!curriculum[grade]) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Noto'g'ri sinf. 2, 3 yoki 4 tanlang." })
    };
  }

  const gradeData = curriculum[grade];
  const topics = gradeData.topics.map(({ id, name, nameRu, description }) => ({
    id,
    name,
    nameRu,
    description
  }));

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ grade, label: gradeData.label, topics })
  };
};
