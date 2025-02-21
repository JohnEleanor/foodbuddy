import connectToDatabase from "@/app/db/database";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: any) {
  if (!params.userLineid) {
    return NextResponse.json({ message: "Missing userLineId parameter", status: 400 });
  }

  let connection;

  try {
    // Connect to the database
    connection = await connectToDatabase();

    // SQL query to fetch user data
    const query = `SELECT * FROM users WHERE user_lineId = ?`;
    const [results]: any = await connection.execute(query, [params.userLineid]);

    if (results.length === 0) {
      return NextResponse.json({ message: "User not found" }, {status: 404});
    }
    // User found
    return NextResponse.json({ message: "User found", status: 200, data: results[0] });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ message: "Internal server error"}, {status: 500});
  } finally {
    // Always close the database connection
    if (connection) {
      await connection.end();
    }
  }
}


export async function PUT(request: Request, { params }: any) {
  const body = await request.json();
  if (!params.userLineid) {
    return NextResponse.json({ message: "Missing userLineId parameter", status: 400 });
  }
  
  let { name, age, weight, height, disease, foodallery, lifestyle, bmi } = body;

  if (!name || !age || !weight || !height || !disease || !foodallery || !lifestyle || !bmi) {
    return NextResponse.json({ message: "Missing required parameters", status: 400 });
  }

   

  try {
    let connection = await connectToDatabase();
    // Ensure that 'disease' and 'foodallery' are strings or serialized JSON if needed
   if (Array.isArray(disease)) {
      disease = JSON.stringify(disease);
    }
    if (Array.isArray(foodallery)) {
      foodallery = JSON.stringify(foodallery);
    }
    const query = `UPDATE users 
      SET user_name = ?, 
      user_age = ?, 
      user_weight = ?, 
      user_height = ?, 
      user_disease = ?, 
      user_foodallery = ?,
      user_lifestyle = ?,
      user_bmi = ?
    WHERE user_lineId = ?`;
    const [results]: any = await connection.execute(query, [
      name,
      age,
      weight,
      height,
      disease,
      foodallery,
      lifestyle,
      bmi,
      params.userLineid,
    ]);
    if (results.affectedRows === 0) {
      await connection.end();
      return NextResponse.json({ message: "User not found", status: 404 });
    }else {
      console.log("User data updated successfully");
      await connection.end();
      return NextResponse.json({ message: "User data updated successfully", status: 200 });
    }


    


  } catch (error) {
    console.error("Error updating user data:", error);
    return NextResponse.json({ message: "Internal server error"}, {status: 500});
    
  }

}