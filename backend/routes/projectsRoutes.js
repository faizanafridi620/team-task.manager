import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Project } from "../models/project.model.js";
import { isAdmin } from "../middlewares/roleMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name)
      return res.status(400).json({ message: "Project name is required" });

    const project = await Project.create({
      name: req.body.name,
      admin: req.user,
      members: [
        {
          user: req.user,
          role: "admin",
        },
      ],
    });
    res.status(201).json({ message: "Project created", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ "members.user": req.user }).populate(
      "members.user",
      "name email",
    );
    res.status(200).json({ message: "Projects fetched", projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/:projectId/add-member",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const { userId } = req.body;
      const { projectId } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(projectId) ||
        !mongoose.Types.ObjectId.isValid(userId)
      )
        return res.status(400).json({ message: "Invalid projectId or userId" });

      const project = await Project.findById(projectId);

      if (!project)
        return res.status(404).json({ message: "Project not found" });

      const isMember = project.members.some(
        (member) => member.user?.toString() === userId,
      );

      if (isMember)
        return res.status(400).json({ message: "User is already a member" });

      project.members.push({
        user: userId,
        role: "member",
      });
      await project.save();
      res.status(200).json({ message: "Member added", project });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: "Server error" });
    }
  },
);

router.delete(
  "/:projectId/remove-member/:userId",
  authMiddleware,
  isAdmin,
  async (req, res) => {
    try {
      const { projectId, userId } = req.params;

      const project = await Project.findById(projectId);

      if (!project)
        return res.status(404).json({ message: "Project not found" });

      if (project.admin.toString() === userId)
        return res.status(400).json({ message: "Admin cannot be removed" });

      const initialLength = project.members.length;

      project.members = project.members.filter(
        (member) => member.user.toString() !== req.params.userId,
      );

      if (project.members.length === initialLength)
        return res.status(404).json({ message: "User not a member" });
      await project.save();
      res.status(200).json({ message: "Member removed", project });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

export default router;
