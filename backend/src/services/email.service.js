import nodemailer from "nodemailer";
import ApiKey from "../modules/settings/apiKey.model.js";
import PageSetting from "../modules/settings/settings.model.js";
import { decrypt } from "../utils/encryption.js";

const getTransporter = async () => {
  const apiKeys = await ApiKey.findOne();
  if (!apiKeys || !apiKeys.mailHost) {
    // Fallback to env if DB not configured
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return nodemailer.createTransport({
    host: apiKeys.mailHost,
    port: parseInt(apiKeys.mailPort),
    secure: apiKeys.mailPort == 465, // Use SSL for port 465
    auth: {
      user: apiKeys.mailUser,
      pass: decrypt(apiKeys.mailPass),
    },
  });
};

const getMailFrom = async () => {
  const apiKeys = await ApiKey.findOne();
  if (apiKeys && apiKeys.mailFrom && apiKeys.mailUser) {
    return `"${apiKeys.mailFrom}" <${apiKeys.mailUser}>`;
  }
  return `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;
}

const getSiteName = async () => {
  const settings = await PageSetting.findOne();
  return settings?.branding?.siteName || "Vanguard";
}

export const sendVerificationEmail = async (email, url) => {
  const transporter = await getTransporter();
  const from = await getMailFrom();
  const siteName = await getSiteName();
  
  await transporter.sendMail({
    from,
    to: email,
    subject: `Verify your email - ${siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome to ${siteName}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>Or copy and paste this link: ${url}</p>
        <p>This link expires in 24 hours.</p>
      </div>
    `,
  });
};

export const sendPasswordResetEmail = async (email, url) => {
  const transporter = await getTransporter();
  const from = await getMailFrom();
  const siteName = await getSiteName();

  await transporter.sendMail({
    from,
    to: email,
    subject: `Reset your password - ${siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${url}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>Or copy and paste this link: ${url}</p>
        <p>This link expires in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

export const sendOrderConfirmationEmail = async (order) => {
  const transporter = await getTransporter();
  const from = await getMailFrom();
  const siteName = await getSiteName();
  
  const itemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} x ${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">৳${item.price * item.quantity}</td>
    </tr>
  `).join('');

  await transporter.sendMail({
    from,
    to: order.shippingAddress.email,
    subject: `Order Confirmation #${order._id.toString().slice(-6).toUpperCase()} - ${siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #000;">Thank you for your order!</h2>
        <p>Hi ${order.shippingAddress.name},</p>
        <p>We've received your order and are getting it ready. Your order ID is <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong>.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Item</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; font-weight: bold;">Subtotal</td>
              <td style="padding: 10px; text-align: right; font-weight: bold;">৳${order.itemsPrice}</td>
            </tr>
            <tr>
              <td style="padding: 10px;">Shipping</td>
              <td style="padding: 10px; text-align: right;">৳${order.shippingPrice}</td>
            </tr>
            ${order.discountAmount > 0 ? `
            <tr>
              <td style="padding: 10px; color: #e11d48;">Discount</td>
              <td style="padding: 10px; text-align: right; color: #e11d48;">-৳${order.discountAmount}</td>
            </tr>
            ` : ''}
            <tr style="font-size: 18px;">
              <td style="padding: 10px; font-weight: bold; border-top: 2px solid #000;">Total</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; border-top: 2px solid #000;">৳${order.totalPrice}</td>
            </tr>
          </tfoot>
        </table>

        <div style="margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
          <h4 style="margin-top: 0;">Shipping Address:</h4>
          <p style="margin-bottom: 0;">${order.shippingAddress.address}<br>Phone: ${order.shippingAddress.phone}</p>
        </div>

        <p style="margin-top: 30px;">If you have any questions, reply to this email or contact our support.</p>
        <p>Best regards,<br><strong>${siteName} Team</strong></p>
      </div>
    `,
  });
};

export const sendOrderStatusUpdateEmail = async (order) => {
  const transporter = await getTransporter();
  const from = await getMailFrom();
  const siteName = await getSiteName();

  await transporter.sendMail({
    from,
    to: order.shippingAddress.email,
    subject: `Order Update: #${order._id.toString().slice(-6).toUpperCase()} is now ${order.orderStatus} - ${siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #000;">Order Status Updated!</h2>
        <p>Hi ${order.shippingAddress.name},</p>
        <p>The status of your order <strong>#${order._id.toString().slice(-6).toUpperCase()}</strong> has been updated to:</p>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #000; color: #fff; border-radius: 10px; text-align: center; font-size: 24px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
          ${order.orderStatus}
        </div>

        <p>You can track your order or view details by logging into your account.</p>
        
        <div style="margin-top: 30px; border-top: 1px solid #eee; pt-20px;">
          <p style="font-size: 12px; color: #666;">
            Order ID: ${order._id}<br>
            Updated at: ${new Date().toLocaleString()}
          </p>
        </div>

        <p style="margin-top: 30px;">If you have any questions, reply to this email or contact our support.</p>
        <p>Best regards,<br><strong>${siteName} Team</strong></p>
      </div>
    `,
  });
};