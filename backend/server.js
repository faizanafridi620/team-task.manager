import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://team-taskmanager-production-39f8.up.railway.app",
        "https://team-task-manager-omega-nine.vercel.app"
    ],
    credentials: true
}))

import authRoutes from "./routes/authRoutes.js";
import projectRoute from "./routes/projectsRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"

app.use("/api/auth",authRoutes)
app.use("/api/projects", projectRoute)
app.use("/api/tasks", taskRoutes)


mongoose.connect(process.env.MONGODB_URI).
    then(() => {
        console.log("MongoDb connected");
        app.listen(process.env.PORT || 8000, () =>{
            console.log(`Server running on port ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDb:", error);
    })