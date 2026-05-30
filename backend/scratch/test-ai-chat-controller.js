import dotenv from "dotenv";
import mongoose from "mongoose";
import ApiKey from "../src/modules/settings/apiKey.model.js";
import { decrypt } from "../src/utils/encryption.js";
import axios from "axios";

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
  return apiKey;
};

// Define tool declarations exactly as in controller
const toolDeclarations = [
  {
    name: "searchProducts",
    description: "Search for clothing products in the catalog by a text query or product name",
    parameters: {
      type: "OBJECT",
      properties: {
        query: {
          type: "STRING",
          description: "The search query (e.g. 'T-shirt', 'Jeans', 'Red jacket')"
        }
      },
      required: ["query"]
    }
  },
  {
    name: "updateProductStock",
    description: "Update the inventory / stock count of a specific size of a product",
    parameters: {
      type: "OBJECT",
      properties: {
        productId: {
          type: "STRING",
          description: "The MongoDB ID of the product"
        },
        sizeName: {
          type: "STRING",
          description: "The name of the size (e.g. 'S', 'M', 'L', 'XL', 'XXL')"
        },
        newStock: {
          type: "INTEGER",
          description: "The new stock count to set (must be >= 0)"
        }
      },
      required: ["productId", "sizeName", "newStock"]
    }
  },
  {
    name: "getDashboardSummary",
    description: "Get general store business metrics, total completed sales revenue, order count, and low stock inventory alerts",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  }
];

const test = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to DB");

  const apiKey = await getApiKey();
  if (!apiKey) {
    console.error("No API key found in DB");
    await mongoose.connection.close();
    return;
  }

  const messages = [
    { role: "model", content: "System Initialized. I am your Command AI assistant..." },
    { role: "user", content: "Give me the store business summary" }
  ];

  const contents = messages.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  const payload = {
    contents,
    tools: [{ functionDeclarations: toolDeclarations }]
  };

  const MODELS = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  
  let success = false;
  for (const model of MODELS) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    try {
      console.log(`Trying model: ${model}...`);
      const response = await axios.post(url, payload);
      console.log(`Success! Candidate Response parts:`, JSON.stringify(response.data.candidates?.[0]?.content?.parts, null, 2));
      success = true;
      break;
    } catch (err) {
      console.error(`Failed for model ${model}:`, err.response ? err.response.data : err.message);
    }
  }

  await mongoose.connection.close();
};

test().catch(console.error);
