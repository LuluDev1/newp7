import express from "express";
import ViteExpress from "vite-express";
import commentRoutes from "./routes/comment-routes.js";
import userRoutes from "./routes/auth-routes.js";
import cors from "cors";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", userRoutes);
app.use("/api/form", commentRoutes);

ViteExpress.listen(app, PORT, () =>
  console.log("Server is on http://localhost:" + PORT)
);
