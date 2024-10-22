"use server";
import {createTransport} from 'nodemailer';
import {sign} from 'jsonwebtoken';

export async function tokenMail(email: string) {
    console.log("email Mail token: ", email);
    try {
        const token = sign({ email }, process.env.NEXT_JWT_SECRET!, { expiresIn: '1h' });

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
                <a href="http://localhost:3000/users/confirmaction?token=${token}">Confirmar email</a>`,
        };


        await transporter.sendMail(mailOptions);

        return { success: true, message: "Correo enviado: "}

    } catch (error) {
        console.error('Error enviando el correo: ', error);
        return { error: 'Error enviando el correo: ' + error.message };
    }
}