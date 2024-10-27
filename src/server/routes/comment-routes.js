import express from "express";

// Middleware
import upload from "../middleware/upload.js";
import { auth } from "../middleware/auth.js";

// Comment Controllers
import {
  addComment,
  getAllComments,
  getUser,
  deleteComment,
  deleteUser,
} from "../controllers/comment-controllers.js";

// Router
const router = express.Router();

router.post("/addComment", auth, upload, addComment);
router.post("/deleteComment/:id", auth, deleteComment);
router.post("/deleteUser", auth, deleteUser);
router.get("/getAllComments", auth, getAllComments);
router.get("/getUser/:userid", auth, getUser);

export default router;
