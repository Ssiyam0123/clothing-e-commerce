import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import mongoose from "mongoose";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../services/email.service.js";


export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.BACKEND_URL ||"https://ecowear-backend.vercel.app/api/auth",

  database: mongodbAdapter(mongoose.connection.db, {
    user: "users",
    session: "sessions",
    account: "accounts",
    verification: "verifications",
  }),

  trustedOrigins: [
    "https://clothing-e-commerce-web.vercel.app", 
    "http://localhost:3000",
  ],

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignInAfterVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async (user, url) => {
      await sendVerificationEmail(user.email, url);
    },
    autoSignInAfterVerification: true,
  },

  forgotPassword: {
    enabled: true,
    sendResetPassword: async (user, url) => {
      await sendPasswordResetEmail(user.email, url);
    },
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    },
  },

  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "customer" },
      phone: { type: "string", defaultValue: "" },
      bio: { type: "string", defaultValue: "" },
      avatar: { type: "string", defaultValue: "" },
      addresses: { type: "string", defaultValue: "[]" },
    },
  },


  session: {
    cookieOptions: {
      sameSite: "none", 
      secure: true,      
      httpOnly: true,
    }
  },

  advanced: {
    cookiePrefix: "vanguard",
    useSecureCookies: true, 
    trustProxy: true, 
    crossDomain: {
        enabled: true,
    }
  },
});