import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const sql = postgres(process.env.VITE_POST_URL);

const createTables = async () => {
  try {
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      userID UUID UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(64) NOT NULL  
    );`;
    console.log("Table 'users' created successfully or already exists.");

    await sql`CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      userID UUID REFERENCES users(userID),
      comment VARCHAR(255) NOT NULL,
      fileloc VARCHAR(255),
      viewed_by UUID[] DEFAULT '{}'
    );`;
    console.log("Table 'comments' created successfully or already exists.");
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

createTables();

export default sql;
