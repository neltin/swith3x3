"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createTeam, getJerseyColors } from "../../../../lib/queryFuntion";

export default function RegisterTeam() {
    const [teamName, setTeamName] = useState("");
    const [jerseyColorId, setJerseyColorId] = useState("");
    const [jerseyColors, setJerseyColors] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Cargar los colores de camisetas desde la base de datos
        const loadColors = async () => {
            const colors = await getJerseyColors();
            setJerseyColors(colors);
        };

        loadColors();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        if (!teamName || !jerseyColorId) {
            setErrorMessage("Por favor, complete todos los campos.");
            return;
        }

        try {
            const result = await createTeam(teamName, jerseyColorId);
            if (result === "success") {
                router.push("/users/panel"); // Redirigir al panel de control después de un registro exitoso
            } else {
                setErrorMessage("Error al registrar el equipo. Intente de nuevo.");
            }
        } catch (error) {
            setErrorMessage("Error del servidor. Intente de nuevo.");
        }
    };

    return (
        <div>
            <h1>Registro del Equipo</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre del equipo:</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        required
                    />
                </div>

                <div>
                    <label>Color de la camiseta:</label>
                    <select
                        value={jerseyColorId}
                        onChange={(e) => setJerseyColorId(e.target.value)}
                        required
                    >
                        <option value="">Seleccionar color</option>
                        {jerseyColors.map((color) => (
                            <option key={color.id} value={color.id}>
                                {color.tipo}
                            </option>
                        ))}
                    </select>
                </div>

                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

                <button type="submit">Registrar equipo</button>
            </form>
        </div>
    );
}