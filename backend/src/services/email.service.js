import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email, url) => {
    await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: email,
        subject: "Verify your email",
        html: `<p>Please verify your email by clicking the link below:</p><a href="${url}">${url}</a>`,
    });
};

export const sendPasswordResetEmail = async (email, url) => {
    await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
        to: email,
        subject: "Reset your password",
        html: `<p>Click the link below to reset your password:</p><a href="${url}">${url}</a>`,
    });
};