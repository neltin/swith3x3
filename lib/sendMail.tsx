"use server";
import {createTransport} from 'nodemailer';
//import { NextResponse } from "next/server";

export async function tokenMail(email: string, token: string) {
    console.log("email Mail token: ", email);
    try {
        const transporter = createTransport({
            service: 'gmail', // o cualquier otro servicio SMTP
            auth: {
                user: process.env.NEXT_EMAIL_USER,
                pass: process.env.NEXT_EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: 'noreply@tuapp.com',
            to: email,
            subject: 'Confirma tu registro',
            html: `<p>Haz click en el siguiente enlace para confirmar tu email:</p>
                <a href="http://localhost:3000/users/confirmaction?token=${token}">Confirmar email</a>
                <p>O ingresa este código de verificación en la página de confirmación: <strong>${token}</strong></p>`,
        };

        await transporter.sendMail(mailOptions);

        return { ok: true, message: "Correo enviado." };

        //return NextResponse.json( "Correo enviado." , {status: 200});

    } catch (error) {
        console.error('Error enviando el correo: ', error);
        return { error: 'Error enviando el correo: ' + error.message };
    }
}