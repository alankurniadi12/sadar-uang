import dotenv from "dotenv";

dotenv.config();

const nodeEnv = process.env.NODE_ENV || "development";
const isProduction = nodeEnv === "production";
const jwtSecret = process.env.JWT_SECRET || "change_this_secret_key";
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sadar_uang";
const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const localClientUrls = isProduction
  ? []
  : ["http://localhost:5173", "http://127.0.0.1:5173"];
const clientUrls = [
  clientUrl,
  ...localClientUrls,
  ...String(process.env.CLIENT_URLS || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean),
].filter((url, index, urls) => urls.indexOf(url) === index);

if (isProduction) {
  const missingVars = [];

  if (!process.env.MONGO_URI) missingVars.push("MONGO_URI");
  if (!process.env.JWT_SECRET) missingVars.push("JWT_SECRET");
  if (!process.env.CLIENT_URL) missingVars.push("CLIENT_URL");

  if (missingVars.length > 0) {
    throw new Error(`Missing required production env vars: ${missingVars.join(", ")}`);
  }

  if (jwtSecret === "change_this_secret_key" || jwtSecret.length < 32) {
    throw new Error("JWT_SECRET must be changed and at least 32 characters in production.");
  }

  if (clientUrl.includes("localhost") || clientUrl.includes("127.0.0.1")) {
    throw new Error("CLIENT_URL must use the deployed frontend URL in production.");
  }

  if (clientUrls.some((url) => url.includes("localhost") || url.includes("127.0.0.1"))) {
    throw new Error("CLIENT_URLS must only contain deployed frontend URLs in production.");
  }

  if (mongoUri.includes("127.0.0.1") || mongoUri.includes("localhost")) {
    throw new Error("MONGO_URI must use a production database in production.");
  }
}

export const env = {
  nodeEnv,
  port: Number(process.env.PORT || 5000),
  mongoUri,
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientUrl,
  clientUrls,
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  mailFrom: process.env.MAIL_FROM || "Sadar Uang <no-reply@sadaruang.local>",
};
