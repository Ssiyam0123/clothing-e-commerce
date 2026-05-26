import mongoose from "mongoose";
import dotenv from "dotenv";
import ApiKey from "../src/modules/settings/apiKey.model.js";
import { decrypt } from "../src/utils/encryption.js";

dotenv.config();

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const keys = await ApiKey.findOne();
  if (keys && keys.geminiApiKey) {
    try {
      const api = decrypt(keys.geminiApiKey);
      console.log("Decrypted API Key:", api);
    } catch (e) {
      console.error("Decryption error:", e);
    }
  }

  await mongoose.connection.close();
};

run().catch(console.error);
