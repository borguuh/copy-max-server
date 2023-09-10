const express = require("express");

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

const {
  businessPlan,
  marketingPlan,
  tweet,
  quote,
  proposal,
  instaCaption,
  invoice,
} = require("../controllers/openai");

router.route("/business").post(requireSignin, businessPlan);
router.route("/marketingPlan").post(requireSignin, marketingPlan);
router.route("/tweet").post(requireSignin, tweet);
router.route("/quote").post(requireSignin, quote);
router.route("/proposal").post(requireSignin, proposal);
router.route("/insta").post(requireSignin, instaCaption);
router.route("/invoice").post(requireSignin, invoice);

module.exports = router;
