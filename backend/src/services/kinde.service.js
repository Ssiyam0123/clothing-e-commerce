import axios from "axios";
import * as jose from "jose";
import crypto from "crypto";

const KINDE_DOMAIN = process.env.KINDE_ISSUER_URL;
const CLIENT_ID = process.env.KINDE_CLIENT_ID;
const CLIENT_SECRET = process.env.KINDE_CLIENT_SECRET;
const REDIRECT_URI = process.env.KINDE_REDIRECT_URL;

export const getLoginUrl = (req) => {
  // Generate a random state (at least 8 chars)
  const state = crypto.randomBytes(16).toString("hex");
  // Store state in session for later validation
  req.session.oauthState = state;
  req.session.save();

  const url = new URL(`${KINDE_DOMAIN}/oauth2/auth`);
  url.searchParams.append("client_id", CLIENT_ID);
  url.searchParams.append("redirect_uri", REDIRECT_URI);
  url.searchParams.append("response_type", "code");
  url.searchParams.append("scope", "openid profile email");
  url.searchParams.append("state", state);
  console.log("🔗 Login URL generated with state");
  return url.toString();
};

export const getLogoutUrl = () => {
  const url = new URL(`${KINDE_DOMAIN}/logout`);
  url.searchParams.append("redirect_uri", process.env.KINDE_SITE_URL);
  return url.toString();
};

export const exchangeCodeForUser = async (code, state, sessionState) => {
  // Validate state
  if (!state || state !== sessionState) {
    throw new Error("Invalid state parameter – possible CSRF attack");
  }

  const tokenUrl = `${KINDE_DOMAIN}/oauth2/token`;
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", REDIRECT_URI);
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);

  console.log("🔄 Exchanging code for token at:", tokenUrl);

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { id_token } = response.data;
    const decoded = jose.decodeJwt(id_token);

    console.log("✅ User info retrieved:", decoded.email);

    return {
      id: decoded.sub,
      email: decoded.email,
      given_name: decoded.given_name || "",
      family_name: decoded.family_name || "",
      picture: decoded.picture || "",
      roles: decoded.roles || [],
    };
  } catch (error) {
    console.error("❌ Token exchange failed:", error.response?.data || error.message);
    throw new Error("Failed to exchange authorization code");
  }
};