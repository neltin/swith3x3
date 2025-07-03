'use server';
import mysqlQuery  from "./bd";
import { RowDataPacket } from 'mysql2';
import { compare, genSalt, hash } from 'bcryptjs';
import { tokenMail } from "./sendMail";
//import { NextResponse } from "next/server";

export async function getTabla() {
    try{    
        return await mysqlQuery(`SELECT * FROM positions`, []);
    }catch{
        return "Error de Server";
    }
}

export async function login(email:string, password:string) {
    const rows = await mysqlQuery('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    const isValid = await compare(password, user.password);
    //const isValid = password == user.contrasena ? true : false;  
    if (!isValid) {
      return null;
    }
  
    return { id: user.id, name: user.nombre, email: user.email };
}

export async function register(first_name: string, last_name: string, dni: string, email: string, password: string) {

    try {
        // Verifica si el email ya existe
        const existingUser = await mysqlQuery('SELECT * FROM users WHERE email = ?', [email]);

        if (Array.isArray(existingUser) && existingUser.length > 0) {
            return { error: "El correo ya está registrado." };
        }

        // Hasheo de la contraseña
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);

        // Inserción del usuario con estado 'Blocked' por defecto
        await mysqlQuery('INSERT INTO users (email, password, status_id) VALUES (?, ?, ?)', [email, hashedPassword, 3]);

        // Obtener el ID del usuario recién creado
        const newUser = await mysqlQuery('SELECT id FROM users WHERE email = ?', [email]) as RowDataPacket[];

        if (Array.isArray(newUser) && newUser.length > 0) {
            const userId = newUser[0].id;
            
            //Crear el registro de jugador del usuario
            await mysqlQuery('INSERT INTO players (first_name, last_name, dni, status_id, user_id) VALUES (?, ?, ?, ?, ? )', [first_name, last_name, dni, 4, userId]);

            // Generar y guardar el token de verificación en la tabla email_verifications
            const token = generateToken();
            const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Expira en 1 hora

            await mysqlQuery('INSERT INTO email_verifications (user_id, token, expires_at) VALUES (?, ?, ?)', [userId, token, expiresAt]);

            // Envía el token de validación por correo
            const sendMail = await tokenMail(email, token);
            return sendMail;
        } else {
            throw new Error("No se pudo obtener el ID del usuario recién creado.");
        }

    } catch (error) {
        console.error("Error registrando el usuario: ", error);
        return { error: "Error del servidor: " + error.message };
    }
}

function generateToken() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }
    return token;
}

export async function confirmEmailToken(userInputToken: string) {
    try {
        const result = await mysqlQuery(
            'SELECT * FROM email_verifications WHERE token = ? AND expires_at > NOW()', [userInputToken]) as RowDataPacket[];

        if (Array.isArray(result) && result.length > 0) {
            const userId = result[0].user_id;

            // Actualizar el estado del usuario a 'Activo' (1)
            await mysqlQuery('UPDATE users SET status_id = ? WHERE id = ?', [1, userId]);

            // Eliminar el registro del token de la tabla `email_verifications`
            await mysqlQuery('DELETE FROM email_verifications WHERE token = ?', [userInputToken]);

            return 'success';
        } else {
            return 'error'; // Token inválido o expirado
        }
    } catch (error) {
        console.error('Error al confirmar el token: ', error);
        return 'error';
    }
}


export async function getUserInfo(id: number) {
    
    try{ 
        const player = await mysqlQuery(`SELECT last_name, first_name, photo_profile, dni, date_birth 
     FROM players WHERE user_id = ? LIMIT 1`, [1]);

     console.log("Player Info: ", player);
        return player;
        
    } catch(error) {
        console.error("Error obteniendo la información del usuario: ", error);
        return 'error';
    }
}


export async function getJerseyColors() {
    try {
        const colors = await mysqlQuery('SELECT id, tipo FROM jersey_color', []);
        return colors;
    } catch (error) {
        console.error("Error obteniendo los colores de camiseta: ", error);
        return [];
    }
}

// Crear un equipo en la base de datos
export async function createTeam(teamName: string, jerseyColorId: string) {
    try {
        // Asume que el usuario está autenticado y tenemos el id del capitán (por ejemplo, en el session o state)
        const captainId = 1; // Aquí debes obtener el ID real del usuario logueado
        const statusId = 1; // Status "Active"

        const result = await mysqlQuery(
            'INSERT INTO teams (team_name, jersey_color_id, captain_id, status_id) VALUES (?, ?, ?, ?)',
            [teamName, jerseyColorId, captainId, statusId]
        );

        if (Array.isArray(result) && result.length === 0) {
            return 'error'; // Si no se afecta ninguna fila, es un error
        }

        return 'success';
    } catch (error) {
        console.error("Error al crear el equipo: ", error);
        return 'error';
    }
}