import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
  }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

export const generateProjectToken = (project) => {
  return jwt.sign({
    _id: project._id,
    projectName: project.projectName,
    projectSector: project.projectSector,
    projectMembers: project.projectMembers,
    projectOwner: project.projectOwner,
    country: project.country,
    city: project.city
  }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

