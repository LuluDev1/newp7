import postgres from "postgres";
import dotenv from "dotenv";
dotenv.config();

const sql = postgres(process.env.VITE_POST_URL);

// TODO If not table first
async function createUsersTable() {
  try {
    await sql`CREATE TABLE users (
        id SERIAL PRIMARY KEY,             
        userID uuid ,
        email VARCHAR(255) NOT NULL UNIQUE,  
        password VARCHAR(64) NOT NULL  
      );`;

    console.log("Table 'users' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}
//
async function createCommentsTable() {
  try {
    await sql`CREATE TABLE comments(
        id SERIAL PRIMARY KEY,
        userID uuid ,
        comment VARCHAR(255) NOT NULL,
        fileloc VARCHAR(255)
      )`;
    console.log("Table 'comments' created successfully.");
  } catch (error) {
    console.error("Error creating table:", error);
  }
}
createUsersTable();
createCommentsTable();

export default sql;
