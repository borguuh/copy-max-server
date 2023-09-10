import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
  currentUser,
  otherUser,
  update,
  deleteUser,
} from "../controllers/user";

router.get("/current-user", requireSignin, currentUser);
router.get("/user/:userId", otherUser);
router.put("/update-user/:userId", requireSignin, update); //edit specific user profile
router.put("/delete-user/:userId", requireSignin, deleteUser); //delete specific user profile

module.exports = router;
