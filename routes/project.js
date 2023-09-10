import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
  uploadImage,
  removeImage,
  create,
  read,
  projects,
  userProjects,
  otherUser,
  deleteProject,
  update,
} from "../controllers/project";

// find all projects
router.get("/projects", projects);
// image
router.post("/project/upload-image", uploadImage);
router.post("/project/remove-image", removeImage);
// project
router.post("/project", requireSignin, create);
router.get("/project/:_id", read); //read specific project
router.get("/user-projects", requireSignin, userProjects);
router.get("/other-user/:userId", otherUser);
router.get("/delete-project/:_id", requireSignin, deleteProject); //delete specific project
router.put("/update/:_id", requireSignin, update); //edit specific project

module.exports = router;
