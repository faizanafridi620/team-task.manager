import { Project } from "../models/project.model.js";

export const isAdmin = async (req,res,next) => {
   try {
     const {projectId} = req.params;
     const project = await Project.findById(projectId);
    
 
     if(!project) return res.status(404).json({message: "Project not found"})
     
     const member = project.members.find(member=> member.user.toString() === req.user)
     
     if(!member || member.role !== "admin") return res.status(403).json({message: "Admin access only"})
 
     next();
   } catch (error) {
    console.log(error);    
     res.status(500).json({message: "Server error"})
   }
}