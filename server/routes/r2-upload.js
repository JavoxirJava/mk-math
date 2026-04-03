// ═══════════════════════════════════════════
//  R2 Presigned URL Generator (Express Route)
//  O'qituvchi PDF yuklash uchun
// ═══════════════════════════════════════════

const express = require("express");
const router = express.Router();
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Cloudflare R2 konfiguratsiya (.env yoki environment variables dan)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "uzmath-books";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

router.post("/", async (req, res) => {
  // Konfiguratsiya tekshirish
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    return res.status(500).json({
      error: "R2 konfiguratsiya topilmadi. Environment variables sozlang."
    });
  }

  try {
    const { fileKey, contentType } = req.body;

    if (!fileKey || !contentType) {
      return res.status(400).json({ error: "fileKey va contentType kerak" });
    }

    // S3-compatible R2 client
    const s3 = new S3Client({
      region: "auto",
      endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    });

    // Presigned PUT URL yaratish (15 daqiqa amal qiladi)
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: fileKey,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 900 });

    // Public URL
    const publicUrl = R2_PUBLIC_URL
      ? `${R2_PUBLIC_URL}/${fileKey}`
      : `https://${R2_BUCKET_NAME}.${R2_ACCOUNT_ID}.r2.dev/${fileKey}`;

    res.json({ uploadUrl, publicUrl });
  } catch (err) {
    console.error("R2 upload error:", err);
    res.status(500).json({ error: "Server xatosi: " + err.message });
  }
});

module.exports = router;
