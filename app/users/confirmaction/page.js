// app/users/confirmaction/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyToken } from '../../../lib/auth';
import { confirmUserEmail } from '../../../lib/queryFuntion';

export default function ConfirmAction() {
    const [message, setMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    useEffect(() => {
        const confirmEmail = async () => {
            if (!token) {
                setMessage('Token inválido o faltante.');
                return;
            }

            try {
                const decoded = await verifyToken(token);
                const email = decoded?.email;

                if (email) {
                    // Llama a la función que confirma el email en la base de datos
                    const result = await confirmUserEmail(email);
                    if (result === 'success') {
                        setMessage('¡Email confirmado exitosamente! Ahora tu cuenta está activa.');
                        router.push('/users/login');
                    } else {
                        setMessage('Hubo un problema al confirmar tu email. Por favor, intenta nuevamente.');
                    }
                } else {
                    setMessage('Token inválido.');
                }
            } catch (error) {
                setMessage('Error al validar el token: ' + error.message);
            }
        };

        confirmEmail();
    }, [token]);

    const handleNextStep = () => {
        router.push('/users/register');
    };

    return (
        <div>
            <h1>Confirmación de Registro</h1>
            <p>{message}</p>
        </div>
    );
}