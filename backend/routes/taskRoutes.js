import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { Task } from "../models/task.model.js";
import { Project } from "../models/project.model.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      priority,
      status,
      assignedTo,
      projectId,
    } = req.body;

    if (!title || !projectId)
      return res
        .status(400)
        .json({ message: "Title and ProjectId are required" });

    const project = await Project.findById(projectId);

    if (!project) return res.status(404).json({ message: "Project not found" });

    const isMember = project.members.find(
      (member) => member.user.toString() === req.user,
    );

    if (!isMember)
      return res
        .status(403)
        .json({ message: "Only project members can create tasks" });

    if (isMember.role !== "admin")
      return res.status(403).json({ message: "Only admin can create tasks" });

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority,
      status,
      projectId,
      assignedTo: assignedTo || req.user,
    });
    res.status(201).json({ message: "Task Created", task });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {

    const { title, projectId } = req.query;
    const query = {};

    if (projectId) {
      if (!mongoose.Types.ObjectId.isValid(projectId))
        return res.status(400).json({ message: "Invalid projectId" });

      const project = await Project.findById(projectId);

      const isMember = project.members.find(
        (member) => member.user.toString() === req.user,
      );

      if (!isMember)
        return res
          .status(403)
          .json({ message: "Only project members can view tasks" });

      query.projectId = projectId;
    }

    if (title) query.title = { $regex: title, $options: "i" };

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email")
      .populate("projectId", "name");


    res.status(200).json({ message: "Tasks fetched", tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.projectId);

    const isMember = project.members.find(
      (member) => member.user.toString() === req.user,
    );

    if (!isMember)
      return res.status(403).json({ message: "Not part of the project" });

    if (isMember.role === "member" && task.assignedTo?.toString() !== req.user)
      return res
        .status(403)
        .json({ message: "Members can only update their tasks" });

    const updateTask = await Task.findByIdAndUpdate(id, req.body, {
      returnDocument: "after",
    })
      .populate("assignedTo", "name email")
      .populate("projectId", "title description");

    res.status(200).json({ message: "Task updated", updateTask });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server error" });
  }
});

router.get("/dashboard/:projectId", authMiddleware, async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    const isMember = project.members.some(
      (member) => member.user.toString() === req.user,
    );

    if (!isMember) return res.status(403).json({ message: "Access denied" });

    const tasks = await Task.find({ projectId }).populate(
      "assignedTo",
      "name email",
    );

    const totalTasks = tasks.length;

    const statusTask = {
      Todo: 0,
      "In Progress": 0,
      Done: 0,
    };
    const taskPerUser = {};

    let dueTask = 0;

    tasks.forEach((task) => {
      if (statusTask[task.status] !== undefined) {
        statusTask[task.status]++;
      }
      const userName = task.assignedTo?.name || "Unassigned";
      taskPerUser[userName] = (taskPerUser[userName] || 0) + 1;
      if (
        task.dueDate &&
        new Date(task.dueDate) < new Date() &&
        task.status !== "Done"
      ) {
        dueTask++;
      }
    });

    res.status(200).json({ totalTasks, statusTask, taskPerUser, dueTask });
  } catch (error) {
    console.log(error);

    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
