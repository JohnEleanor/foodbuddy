import connectToDatabase from "@/app/db/database";


export async function POST(request : Request) {

    const body = await request.json();
    if (!body.user_lineId) return Response.json({message : "param is not found"}, {status : 404});

    const { user_lineId } = body; 
    try {
        const connection = await connectToDatabase();   
        if (!connection) return Response.json({message : "can't connect to database"})
        

            
        // Get All history of user
        const query =  `
        SELECT 
            users.user_name,
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
        `;
        const [result] : any = await connection.execute(query, [user_lineId]);

        if (result.lenght === 0) return  Response.json({ message : "user not founnd"}, {status : 404});

        return Response.json({message : "success", result : result})
    } catch (error) {
        console.log(error)
        return Response.json({message : "can't connect to database"})
    }
    



    // return Response.json({message : "[api] api/history is working"})
}
