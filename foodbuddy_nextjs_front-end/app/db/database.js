import mysql from 'mysql2/promise';

async function connectToDatabase() {
  try {
    // Create the connection to the database
    const connection = await mysql.createConnection({
      host: process.env.NEXT_PUBLIC_DB_HOST,
      user: process.env.NEXT_PUBLIC_DB_USER,
      password: process.env.NEXT_PUBLIC_DB_PASSWORD,
      database: process.env.NEXT_PUBLIC_DB_NAME,
      port: process.env.NEXT_PUBLIC_DB_PORT,
    });

    // Test the connection
    // console.log('Connected to the database successfully!');
    return connection;
  } catch (error) {
    console.error('Failed to connect to the database:', error.message);
    throw error; // Rethrow the error for handling in calling functions
  }
}

export default connectToDatabase;
