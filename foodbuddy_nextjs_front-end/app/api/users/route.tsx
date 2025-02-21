import connectToDatabase from "@/app/db/database";

export async function POST(request : Request) {
  try {
    const connection = await connectToDatabase();
    // console.log("Connect : ",connection)
    const body = await request.json();
    const {
      userName, age, weight, height, gender, bmi, lifestyle,
      target, targetWeight, disease, userFoodAllery, 
      displayName, lineUserId, pictureUrl, dailyCalories
    } = body;

    // ตรวจสอบค่าที่จำเป็น
    const requiredFields = [
      "userName", "age", "weight", "height", "gender",
      "bmi", "lifestyle", "target", "targetWeight",
      "disease", "userFoodAllery", "displayName",
      "lineUserId", "pictureUrl"
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return new Response(JSON.stringify({
          message: `Missing required parameter: ${field}`,
          error: "Invalid data"
        }), { status: 400 });
      }
    }

    // แปลงค่าก่อนส่งเข้า database (เช่น แปลงตัวเลข)
    const query = `
      INSERT INTO users 
      (user_name, user_age, user_weight, user_height, user_gender, 
       user_bmi, user_lifestyle, user_target, user_targetweight, 
       user_disease, user_foodallery, user_displayName, 
       user_lineId, user_pictureUrl,user_dailycalories) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      String(userName), Number(age), Number(weight), Number(height), String(gender),
      Number(bmi), String(lifestyle), String(target), Number(targetWeight), 
      String(disease), String(userFoodAllery), String(displayName), 
      String(lineUserId), String(pictureUrl), Number(dailyCalories)
    ];

    // Execute query
    await connection.execute(query, params);

    return new Response(JSON.stringify({ message: "User data saved successfully", status : 200 }), { status: 200 });
  } catch (error) {
    console.error("Error saving user data:", error);
    return new Response(JSON.stringify({
      message: "Internal Server Error",
      error: error
    }), { status: 500 });
  }
}


// Get user data eat food history 
export async function GET(request : Request) {
  try {
    const connection = await connectToDatabase();
    const query = `SELECT * FROM users `;
    const [rows] = await connection.execute(query);
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return new Response(JSON.stringify({
      message: "Internal Server Error",
      error: error
    }), { status: 500 });
  }
  // return Response.json({ message : "This method not found" });
}


