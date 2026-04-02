// ═══════════════════════════════════════════
//  R2 Presigned URL Generator (Netlify Function)
//  O'qituvchi PDF yuklash uchun
// ═══════════════════════════════════════════

const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// Cloudflare R2 konfiguratsiya (Netlify Environment Variables dan olinadi)
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || "uzmath-books";
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL; // masalan: https://pub-xxxx.r2.dev

exports.handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // OPTIONS (preflight)
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers };
  }

  // Faqat POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  // Konfiguratsiya tekshirish
  if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "R2 konfiguratsiya topilmadi. Environment variables sozlang." }),
    };
  }

  try {
    const { fileKey, contentType } = JSON.parse(event.body);

    if (!fileKey || !contentType) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "fileKey va contentType kerak" }),
      };
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ uploadUrl, publicUrl }),
    };
  } catch (err) {
    console.error("R2 upload error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server xatosi: " + err.message }),
    };
  }
};
