// lib/auth.ts
"use server";
import { verify } from 'jsonwebtoken';

export async function verifyToken(token: string) {
    try {
        const decoded = await verify(token, process.env.NEXT_JWT_SECRET!);
        return decoded;
    } catch (error) {
        throw new Error('Token no válido o expirado');
    }
}