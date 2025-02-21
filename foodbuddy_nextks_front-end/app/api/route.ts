import connectToDatabase from "@/app/db/database";

export async function GET() {
    try {
        const connection = await connectToDatabase();
        const [results, fields] = await connection.execute("SELECT * FROM users");
        return Response.json({ message: "Healy Check", results : fields });
    } catch (error) {
        console.error(error);
        return Response.json({ message: error });
        
    }
}  


export async function POST(request: Request) {
    try {
        const connection = await connectToDatabase();
        const body = await request.json();

        // ✅ ใช้ body แทน data และแก้ชื่อ field ให้ตรงกัน
        const {
            calories, protein, carbohydrates, fat, food_name, user_lineId, category
        } = body;      

        // ✅ ตรวจสอบค่า ก่อน INSERT
        if (!calories || !protein || !carbohydrates || !fat || !food_name || !user_lineId || !category) {
            return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
        }

        // ✅ ใช้ SQL Statement ที่ถูกต้อง
        const query = `
            INSERT INTO user_eat_history (calories, protein, carbohydrates, fat, food_name, user_lineId, category, eaten_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
        `;
        const params = [calories, protein, carbohydrates, fat, food_name, user_lineId, category];

        const [result]: any = await connection.execute(query, params);

        // ✅ เช็คว่าการ INSERT สำเร็จหรือไม่
        if (result.affectedRows > 0) {
            return new Response(JSON.stringify({ message: "success" }), { status: 201 });
        } else {
            return new Response(JSON.stringify({ message: "fail" }), { status: 500 });
        }

    } catch (error) {
        console.error("SQL Error:", error);
        return new Response(JSON.stringify({ error: "Database error", details: error }), { status: 500 });
    }
}
