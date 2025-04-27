import nodemailer from "nodemailer";

export async function sendEmail({ to, subject, html, replyTo }) {
    console.log(
        process.env.SMTP_USER,
        process.env.SMTP_PASS,
    )
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465, // use 587 if TLS preferred
        secure: true, // true for port 465, false for 587
        replyTo: replyTo,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const mailOptions = {
        from: `"Your Shopify App" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("Email send error:", error);
        return { success: false, error };
    }
}
