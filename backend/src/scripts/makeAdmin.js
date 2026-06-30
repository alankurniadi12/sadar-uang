import mongoose from "mongoose";

import { env } from "../config/env.js";
import User from "../models/User.js";

const email = process.argv[2]?.toLowerCase();

if (!email) {
  console.error("Gunakan: npm run make:admin -- email@example.com");
  process.exit(1);
}

await mongoose.connect(env.mongoUri);

const user = await User.findOneAndUpdate(
  { email },
  { role: "admin", status: "active" },
  {
    new: true,
    runValidators: true,
  },
).select("-passwordHash");

await mongoose.disconnect();

if (!user) {
  console.error(`User dengan email ${email} tidak ditemukan.`);
  process.exit(1);
}

console.log(`${user.email} sekarang menjadi admin.`);
