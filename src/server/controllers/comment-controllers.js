import sql from "../db.js";
import fs from "fs";

// Add comment
const addComment = async (req, res) => {
  try {
    const { userId } = req.user;
    const { textarea } = req.body;

    // Validate if values Exsit
    if (!userId) {
      return res.status(400).json({ error: "User ID is required." });
    }

    if (!textarea) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    // If Media
    let fileurl = "";

    if (req.file) {
      fileurl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    // Insert the comment into the database
    await sql`
      INSERT INTO comments(userid, comment, fileloc)
      VALUES(${userId}, ${textarea}, ${fileurl})
    `;
    return res.status(201).json({ message: "Comment added successfully." });
  } catch (error) {
    console.error("Error adding comment:", error);
    // Handle DB Errorrs
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ error: "Database connection error." });
    }
    // General error handling
    return res
      .status(500)
      .json({ error: "An error occurred while adding the comment." });
  }
};

// Get All Comments
const getAllComments = async (req, res) => {
  try {
    const comments = await sql`
      SELECT id, userid, comment, fileloc 
      FROM comments
      ORDER BY id DESC

    `;

    if (comments.length > 0) {
      return res.status(200).json(comments);
    } else {
      return res.status(404).json({ message: "No comments found." });
    }
  } catch (error) {
    console.error("Error fetching comments:", error);

    // Handle DB Errorrs
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ error: "Database connection error." });
    }
    return res
      .status(500)
      .json({ error: "An error occurred while fetching comments." });
  }
};

// Get Current User
const getUser = async (req, res) => {
  try {
    const { userid } = req.params;
    // Check if userid is provided
    if (!userid) {
      return res.status(400).json({ error: "User ID is required." });
    }

    const email = await sql`
      SELECT email
      FROM users
      WHERE userid = ${userid}
    `;

    if (email.length > 0) {
      return res.status(200).json({ email: email[0].email });
    } else {
      return res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    console.error("Error fetching user email:", error);

    // Handle DB Errorrs
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ error: "Database connection error." });
    }

    return res
      .status(500)
      .json({ error: "An error occurred while fetching the email." });
  }
};

// Delete Comment
const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { userid } = req.body;
  const { userId } = req.user;

  try {
    if (!id) {
      return res.status(400).json({ message: "Comment ID is required" });
    }
    if (!userid) {
      return res.status(400).json({ message: "User ID is required in body" });
    }

    // Ensure the request is from the authorized user
    if (userId !== userid) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }

    // Fetch comment file location and delete from machine
    const commentfile = await sql`
      SELECT fileloc FROM comments WHERE id=${id}
    `;
    const filePath = commentfile[0]?.fileloc;

    if (filePath) {
      // Attempt to delete the file if it exists
      fs.unlink(filePath.slice(22), (err) => {
        if (err) {
          console.error(`Error deleting file at ${filePath}:`, err);
          // Optional: You could choose to return here if file deletion is critical
          return res
            .status(500)
            .json({ message: "Error deleting associated file" });
        } else {
          console.log("File deleted successfully");
        }
      });
    }

    // Delete Comment
    const result = await sql`
      DELETE FROM comments WHERE id=${id}
    `;
    if (result.rowCount === 0) {
      console.log(`No comment found with id ${id}`);
      return res.status(404).json({ message: "Comment not found" });
    }

    console.log(`Comment with id ${id} deleted`);
    return res
      .status(200)
      .json({ message: "Comment and associated file deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);

    // Handle DB Errorrs
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Database connection error" });
    }

    return res.status(500).json({ message: "Server error" });
  }
};

// TODO Delete Specific User
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.user;

    if (userId) {
      const result = await sql`
      DELETE FROM users WHERE userid=${userId}
     
    `;
      await sql`DELETE FROM comments WHERE userid=${userId}`;

      if (result.rowCount === 0) {
        console.log(`No user found with id ${userId}`);
        return res.status(404).json({ message: "User not found" });
      } else {
        return res
          .status(200)
          .json({ message: `User ${userId} deleted successfully` });
      }
    } else {
      console.log("No userId provided in request");
      return res.status(400).json({ message: "Bad request: Missing userId" });
    }
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { addComment, getAllComments, getUser, deleteComment, deleteUser };
