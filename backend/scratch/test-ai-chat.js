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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [{ text: "Check for any critical or low stock inventory alerts" }]
      }
    ],
    tools: [
      {
        functionDeclarations: [
          {
            name: "getDashboardSummary",
            description: "Get general store business metrics, total completed sales revenue, order count, and low stock inventory alerts",
            parameters: {
              type: "OBJECT",
              properties: {}
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await axios.post(url, payload);
    console.log("Response status:", response.status);
    console.log("Response data candidates:", JSON.stringify(response.data.candidates?.[0], null, 2));
  } catch (err) {
    console.error("Gemini Error:", err.response ? err.response.data : err.message);
  }

  await mongoose.connection.close();
};

run().catch(console.error);
