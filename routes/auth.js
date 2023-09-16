import express from "express";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// controllers
import {
  register,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
  getSubscription,
  getCustomer,
  emailLogin,
  verifyEmail,
} from "../controllers/auth";

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/subscription", requireSignin, getSubscription);
router.get("/customer", requireSignin, getCustomer);
router.post("/email/login", emailLogin);
router.post("/email/verify", verifyEmail);

module.exports = router;
