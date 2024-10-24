// app/users/confirmaction/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { confirmEmailToken } from '../../../lib/queryFuntion';

export default function ConfirmAction() {
    const [message, setMessage] = useState('');
    const [tokenInputs, setTokenInputs] = useState(new Array(6).fill(''));
    const [isTokenFromUrl, setIsTokenFromUrl] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const tokenFromUrl = searchParams.get('token'); // Token desde URL

    // Maneja el cambio de los inputs
    const handleInputChange = (value, index) => {
        const updatedInputs = [...tokenInputs];
        updatedInputs[index] = value.toUpperCase();
        setTokenInputs(updatedInputs);
    };

    // Combina los valores de los inputs
    const combinedToken = tokenInputs.join('');

    useEffect(() => {
        const confirmEmail = async (token) => {
            try {
                const result = await confirmEmailToken(token);
                if (result === 'success') {
                    setMessage('¡Email confirmado exitosamente! Ahora tu cuenta está activa.');
                    router.push('/users/login');
                } else {
                    setMessage('Token inválido o expirado.');
                }
            } catch (error) {
                setMessage('Error al validar el token: ' + error.message);
            }
        };

        if (tokenFromUrl) {
            // Si el token viene en la URL, confírmalo automáticamente
            setIsTokenFromUrl(true);
            confirmEmail(tokenFromUrl);
        }
    }, [tokenFromUrl]);

    const handleManualConfirm = async () => {
        if (combinedToken.length === 6) {
            try {
                const result = await confirmEmailToken(combinedToken);
                if (result === 'success') {
                    setMessage('¡Email confirmado exitosamente! Ahora tu cuenta está activa.');
                    router.push('/users/login');
                } else {
                    setMessage('Token inválido o expirado.');
                }
            } catch (error) {
                setMessage('Error al validar el token: ' + error.message);
            }


        } else {
            setMessage('Por favor ingresa un token válido de 6 caracteres.');
        }
    };

    return (
        <div>
            <h1>Confirmación de Registro</h1>
            <p>{message}</p>

            {!isTokenFromUrl && (
                <div>
                    <p>Introduce tu token de confirmación:</p>
                    <div style={{ display: 'flex' }}>
                        {tokenInputs.map((value, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength={1}
                                value={value}
                                onChange={(e) => handleInputChange(e.target.value, index)}
                                style={{ width: '40px', margin: '0 5px', textAlign: 'center', fontSize: '20px' }}
                            />
                        ))}
                    </div>
                    <button onClick={handleManualConfirm}>Confirmar Email</button>
                </div>
            )}
        </div>
    );
}