import express from "express";
import { errorHandler } from "./middlewares/error.handler";
import userRoutes from "./modules/auth/routes";
import noteRoutes from "./modules/notes/routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// allow frontend to access the API
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// routes
app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// catches all errors from routes
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("🚀 Server running on port: " + port)
});