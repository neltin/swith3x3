"use server";
import { createConnection } from 'mysql2/promise';

export default async function mysqlQuery (query: string , data: (string | number)[]){
    const db = await createConnection({
        host: process.env.NEXT_DATABASE_HOST,
        port: 3306,
        user: process.env.NEXT_DATABASE_USER,
        password: process.env.NEXT_DATABASE_PASSWORD,
        database: process.env.NEXT_DATABASE_NAME
    });

    const [result] = await db.execute(query, data);

    await db.end();

    return result;
}

