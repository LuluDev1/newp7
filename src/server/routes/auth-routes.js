import express from "express";

// Auth controllers
import { userSignUp, userLogin } from "../controllers/auth-controllers.js";

// Router
const router = express.Router();

router.post("/login", userLogin);
router.post("/signup", userSignUp);

export default router;
