"use server";

import nodemailer from 'nodemailer';

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export async function sendEmail(from: string, to: string, subject: string, emailContent: string) {
    try {
        const info = await transporter.sendMail({
            from,
            to,  
            subject,
            html: emailContent, 
        });

        return { info };
    } catch (error: any) {
        throw new Error("Error occurred while sending email: " + error.message);
    }
}
