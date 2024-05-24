import express from "express";
import Project from "../models/projectModel.js";
import { generateToken } from "../utils.js";
import User from "../models/userModel.js";

const projectRouter = express.Router();

projectRouter.post("/create", async (req, res) => {
  const { projectOwner, projectName, projectDescription, projectSizeRange, projectDeadline, projectSector, projectMembers, country, city } = req.body;
  try {
    const existingProject = await Project.findOne({ projectOwner: projectOwner });
    const user = await User.findOne({ email: projectOwner });

    if (existingProject) {
      return res.status(401).send({ message: "Project already exists" });
    }

    if (!user) {
      return res.status(401).send({ message: "Project Owner hasn't registered with us" });
    }

    const authorizedOwners = [
      "micodan369@gmail.com",
      "shimwamanahenritresor@gmail.com",
      "glorineza2@gmail.com",
      "numwalilydia2022@gmail.com",
      "ishimwejustin67@gmail.com",
      "itsmugishasamuella@gmail.com",
    ];

    if (!authorizedOwners.includes(projectOwner)) {
      return res.status(401).send({ message: "The project is still under development" });
    }

    const newProject = new Project({
      projectName,
      projectDescription,
      projectSizeRange,
      projectDeadline,
      projectSector,
      projectMembers,
      projectOwner,
      country,
      city,
    });

    const project = await newProject.save();

   return res.status(201).send({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user),
      },
      project: {
        _id: project._id,
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        projectSizeRange: project.projectSizeRange,
        projectDeadline: project.projectDeadline,
        projectSector: project.projectSector,
        projectMembers: project.projectMembers,
        projectOwner: project.projectOwner,
        country: project.country,
        city: project.city,
        token: generateToken(project),
      },
    });
  } catch (error) {
    res.status(500).send({ message: "An error occurred while creating the project" });
  }
});

export default projectRouter;
