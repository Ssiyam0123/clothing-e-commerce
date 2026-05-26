import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import ApiKey from "../src/modules/settings/apiKey.model.js";
import { decrypt } from "../src/utils/encryption.js";

dotenv.config();

const getApiKey = async () => {
  let apiKey = "";
  try {
    const apiKeys = await ApiKey.findOne();
    if (apiKeys && apiKeys.geminiApiKey) {
      apiKey = decrypt(apiKeys.geminiApiKey);
    }
  } catch (error) {
    console.error("Error reading geminiApiKey from DB:", error.message);
  }
  if (!apiKey) {
    apiKey = process.env.GEMINI_API_KEY;
  }
  return apiKey;
};

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const apiKey = await getApiKey();
  console.log("API Key loaded:", apiKey ? "YES" : "NO");

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

  try {
    const response = await axios.get(url);
    console.log("Supported models:");
    response.data.models.forEach(m => {
      console.log(`- ${m.name}`);
    });
  } catch (err) {
    console.error("Gemini Error:", err.response ? err.response.data : err.message);
  }

  await mongoose.connection.close();
};

run().catch(console.error);
