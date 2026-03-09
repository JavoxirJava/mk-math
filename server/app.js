const express = require("express");
const path = require("path");
const topicsRouter = require("./routes/topics");
const generateRouter = require("./routes/generate");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/topics", topicsRouter);
app.use("/api/generate", generateRouter);

app.listen(PORT, () => {
  console.log(`UzMath Mini running at http://localhost:${PORT}`);
});
