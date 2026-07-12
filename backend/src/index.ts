import express from "express";
import { errorHandler } from "./middlewares/error.handler";
import userRoutes from "./modules/auth/routes"

const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);


app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("🚀 Server running on port: " + port)
});