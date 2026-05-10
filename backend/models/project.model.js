import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,

        },
        role: {
            type: String,
            enum: ["admin", "member"],
            default: "member"
        }
    }]
})

export const Project = mongoose.model("Project", projectSchema)