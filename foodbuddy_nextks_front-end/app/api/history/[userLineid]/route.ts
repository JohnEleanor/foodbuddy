import connectToDatabase from "@/app/db/database";
import { NextResponse } from "next/server";


export async function GET(request: Request, { params }: any) {

    if (!params.userLineid) {
        return NextResponse.json({message : "param is not found"}, {status : 404});
    }

    try {
        const connection = await connectToDatabase();
        const query = `
        SELECT 
            users.user_lineId,
            users.user_name,
            users.user_dailycalories,
            user_eat_history.food_name,
            user_eat_history.calories,
            user_eat_history.protein,
            user_eat_history.fat,
            user_eat_history.carbohydrates,
            user_eat_history.eaten_at,
            user_eat_history.category
        FROM 
            users
        LEFT JOIN 
            user_eat_history 
        ON 
            users.user_lineId = user_eat_history.user_lineId
        WHERE 
            users.user_lineId = ? 
            AND DATE(user_eat_history.eaten_at) = CURDATE();


        `;
        const [result] : any = await connection.execute(query, [params.userLineid]);

        if (result.lenght === 0) {
            return  NextResponse.json({ message : "user not founnd"}, {status : 404});
        }

        return Response.json({message : "found data", result : result})
    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message: error }))
    }
}