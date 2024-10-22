'use server';
import mysqlQuery  from "./bd";
import { compare, genSalt, hash } from 'bcryptjs';
import { tokenMail } from "./sendMail";

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
/*
export async function register(email:string, password:string) {
    try {
        const salt = await genSalt(10);
        const pass = await hash(password, salt);
        
        await mysqlQuery('INSERT INTO users (email, password) VALUES (?, ?)', [email, pass]);
        
        console.log("Registro exitoso");

    }catch(error){
        console.error("Error registrando el usuario: ", error);
    }    
}
*/

export async function register(first_name: string, last_name: string, email: string, password: string) {

    try {
        // Verifica si el email ya existe
        const existingUser = await mysqlQuery('SELECT * FROM users WHERE email = ?', [email]);
        
        console.log("existingUser: ", existingUser);

        if (Array.isArray(existingUser) && existingUser.length > 0) {
            return { error: "El correo ya está registrado." };
        }

        // Hasheo de la contraseña
        const salt = await genSalt(10);
        const hashedPassword = await hash(password, salt);
        
        // Inserción del usuario con estado 'Blocked' por defecto
        await mysqlQuery('INSERT INTO users (first_name, last_name, email, password, status_id) VALUES (?, ?, ?, ?, ?)', [first_name, last_name, email, hashedPassword, 3]);

        // Envía el token de validación por correo
        const sendMail = await tokenMail(email);
        console.log("sendMail: ", sendMail);
        return  sendMail;

    } catch (error) {
        console.error("Error registrando el usuario: ", error);
        return { error: "Error del servidor: " + error.message };
    }
}


export async function confirmUserEmail(email: string) {
    try {
        const result = await mysqlQuery(
            'UPDATE users SET status_id = ? WHERE email = ? AND status_id = ?',
            [1, email, 3] // status_id 1 = Active, 3 = Blocked
        );
        if (Array.isArray(result) && result.length === 0) {
            return 'error'; // Si no se afectó ninguna fila, es un error
        }
        
        return 'success'; // Usuario actualizado exitosamente
    } catch (error) {
        console.error('Error al confirmar el email: ', error);
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