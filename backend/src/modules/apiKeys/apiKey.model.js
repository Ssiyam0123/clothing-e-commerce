import mongoose from "mongoose";

const apiKeySchema = new mongoose.Schema(
  {
    sslCommerz: {
      storeId: { type: String, select: false },
      storePassword: { type: String, select: false },
      isLive: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true }, 
    },
    bkash: {
      appKey: { type: String, select: false },
      appSecret: { type: String, select: false },
      userName: { type: String, select: false },
      password: { type: String, select: false },
      isLive: { type: Boolean, default: false },
      isActive: { type: Boolean, default: true }, 
    },
    pathao: {
      clientId: { type: String, select: false },
      clientSecret: { type: String, select: false },
      storeId: { type: String },
      userName: { type: String, select: false },
      password: { type: String, select: false },
      baseURL: {
        type: String,
        default: "https://courier-api-sandbox.pathao.com",
      }, 
      isActive: { type: Boolean, default: true },
    },
    meta: {
      pixelId: { type: String },
      accessToken: { type: String, select: false },
      testEventCode: { type: String },
      isActive: { type: Boolean, default: true }, 
    },
    context7: {
      apiKey: { type: String, select: false },
      isActive: { type: Boolean, default: true },
    },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

const ApiKey = mongoose.model("ApiKey", apiKeySchema);
export default ApiKey;
