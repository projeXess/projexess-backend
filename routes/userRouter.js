import express from "express";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import Project from "../models/projectModel.js";
import { generateToken } from "../utils.js";

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(401).send({ message: "User already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password),
    });

    const user = await newUser.save();

    res.send({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).send({ message: "An error occurred while registering the user" });
  }
});

userRouter.get('/debug', async (req, res) => {
  try {
    const users = await User.find({});
    res.send({ users });
  } catch (error) {
    res.status(500).send({ message: "An error occurred while fetching users" });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ message: "Invalid email or password" });
    }

    const project = await Project.findOne({ projectOwner: user.email });

    res.status(201).send({
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
    res.status(500).send({ message: "Internal server error" });
  }
});

userRouter.put("/update/:userId", async (req, res) => {
  const { firstName, lastName, email, phoneNumber } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { firstName, lastName, email, phoneNumber },
      { new: true }
    );

    const project = await Project.findOne({ projectOwner: email });



    res.status(201).send({
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        token: generateToken(updatedUser),
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
    res.status(500).json({ message: "Internal server error" });
  }
});

export default userRouter;
