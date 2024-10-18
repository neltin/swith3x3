import mysqlQuery  from "./bd";
import { compare, genSalt, hash } from 'bcryptjs';

export async function getTabla() {
    const id = 4;
    try{    
        return await mysqlQuery(
            `SELECT 
                t.id,
                e.nombre as nombre,
                t.puntos as pts,
                t.partidos_jugados as pj,
                t.partidos_ganados as pg,
                t.partidos_perdidos as pp,
                t.goles_favor as gf,
                t.goles_contra as gc,
                t.goles_diferencia as dif

            FROM TABLA AS t LEFT JOIN EQUIPO as e ON e.id = t.fkequipo 

            WHERE fktorneo= ${id}
            ORDER BY pts DESC, dif DESC, gf DESC`,
     []);
    }catch{
        return "Error de Server";
    }
}


export async function login(email:string, password:string) {
    const rows = await mysqlQuery('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = rows[0];

    const isValid = await compare(password, user.contrasena);
    //const isValid = password == user.contrasena ? true : false;  
    if (!isValid) {
      return null;
    }
  
    return { id: user.id, name: user.nombre, email: user.email };
}

export async function register(email:string, password:string) {
    try {
        const salt = await genSalt(10);
        const pass = await hash(password, salt);
        
        await mysqlQuery('INSERT INTO usuarios (email, contrasena, fkcategoria) VALUES (?, ?, ?)', [email, pass, "2"]);
        
        console.log("Registro exitoso");

    }catch(error){
        console.error("Error registrando el usuario: ", error);
    }    
}
