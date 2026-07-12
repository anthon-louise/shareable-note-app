import express from "express";
import { errorHandler } from "./middlewares/error.handler";
import userRoutes from "./modules/auth/routes";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api/users", userRoutes);


app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("🚀 Server running on port: " + port)
});