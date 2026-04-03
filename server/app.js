require("dotenv").config();
const express = require("express");
const path = require("path");
const topicsRouter = require("./routes/topics");
const generateRouter = require("./routes/generate");
const r2UploadRouter = require("./routes/r2-upload");

const app = express();
const PORT = process.env.PORT || 3000;

// JSON body parser
app.use(express.json());

// Serve static files from public/
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api/topics", topicsRouter);
app.use("/api/generate", generateRouter);
app.use("/api/r2-upload", r2UploadRouter);

app.listen(PORT, () => {
  console.log(`UzMath Mini running at http://localhost:${PORT}`);
});
