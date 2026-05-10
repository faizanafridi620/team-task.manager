import express from "express"
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

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