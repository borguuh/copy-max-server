import express from "express";

const router = express.Router();

// middleware
import {
  requireSignin,
  checkTwoFactorAuth,
  checkEmailVerification,
} from "../middlewares";

// controllers
import {
  register,
  verifySignup,
  login,
  logout,
  currentUser,
  forgotPassword,
  resetPassword,
  getSubscription,
  getCustomer,
  emailLogin,
  verifyEmail,
  enableTwoFactorAuth,
  disableTwoFactorAuth,
  twoFactorAuth,
} from "../controllers/auth";

router.post("/register", register);
router.post("/register/verify", verifySignup);
router.post("/login", checkTwoFactorAuth, checkEmailVerification, login);
router.get("/logout", logout);
router.get("/current-user", requireSignin, currentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/subscription", requireSignin, getSubscription);
router.get("/customer", requireSignin, getCustomer);
router.post("/email/login", emailLogin);
router.post("/email/verify", verifyEmail);
router.post("/2fa/enable", enableTwoFactorAuth);
router.post("/2fa/disable", disableTwoFactorAuth);
router.post("/2fa/auth", twoFactorAuth);

module.exports = router;
