"use server";

import { Resend } from 'resend';
import * as React from 'react';
import EmailTemplate from '@/components/email-template/appointment-email';

const resend = new Resend(process.env.RESEND_API_KEY);



export async function sendEmailToBusiness(from: string, to: string, subject: string, emailContent: string) {
    try {
        const { data, error } = await resend.emails.send({
            from,
            to: [to],
            subject,
            html: emailContent,
          });

        if (error) {
            throw new Error("Failed to send email: " + error.message);
        }

        return { data };
    } catch (error: any) {
        throw new Error("Error occurred while sending email: " + error.message);
    }
}