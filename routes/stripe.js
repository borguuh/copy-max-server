const express = require("express");

// middleware
import { requireSignin } from "../middlewares";
const router = express.Router();

const {
  createCheckout,
  createWebhook,
  createPortal,
} = require("../controllers/stripe");

router.post("/checkout", requireSignin, createCheckout);
router.post("/webhook", createWebhook);
router.post("/portal", createPortal);

module.exports = router;
// protect middleware
