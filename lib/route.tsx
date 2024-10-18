import { NextRequest, NextResponse } from "next/server";
import mysqlQuery from "./bd";


const GET = async(request: NextRequest) => {
    try{    
        const result = await mysqlQuery("SELECT * FROM campeones", []);

        return NextResponse.json( result , {status: 200});
    }catch{
        return NextResponse.json({ error: "Error fetching data" }, {status: 500});
    }
};

export {GET}
