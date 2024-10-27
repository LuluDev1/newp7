import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"; // Ensure bcrypt is imported
import sql from "../db.js";
import { v4 as uuidv4 } from "uuid";

const userSignUp = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await sql`SELECT email FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      const hash = await bcrypt.hash(password, 10);
      const userID = uuidv4();
      await sql`INSERT INTO users(email, userid, password) VALUES(${email}, ${userID}, ${hash})`;

      res.status(200).send("User added successfully");
    } else {
      res.status(400).send("Already a User");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred during registration." });
  }
};

const userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user =
      await sql`SELECT email, userid, password, id FROM users WHERE email = ${email}`;

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign({ userId: user[0].userid }, "Random", {
      expiresIn: "24h",
    });

    res.status(200).json({
      email,
      userId: user[0].userid,
      accessToken: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export { userSignUp, userLogin };
