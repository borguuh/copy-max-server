const express = require("express");

const router = express.Router();

// middleware
import { requireSignin, checkFreePlanUsage } from "../middlewares";

const {
  businessPlan,
  marketingPlan,
  tweet,
  quote,
  proposal,
  instaCaption,
  invoice,
  linkedin,
  ads,
  paraphrase,
} = require("../controllers/openai");

router.route("/business").post(requireSignin, checkFreePlanUsage, businessPlan);
router
  .route("/marketingPlan")
  .post(requireSignin, checkFreePlanUsage, marketingPlan);
router.route("/tweet").post(requireSignin, checkFreePlanUsage, tweet);
router.route("/quote").post(requireSignin, checkFreePlanUsage, quote);
router.route("/proposal").post(requireSignin, checkFreePlanUsage, proposal);
router.route("/insta").post(requireSignin, checkFreePlanUsage, instaCaption);
router.route("/invoice").post(requireSignin, checkFreePlanUsage, invoice);
router.route("/linkedin").post(requireSignin, checkFreePlanUsage, linkedin);
router.route("/ads").post(requireSignin, checkFreePlanUsage, ads);
router.route("/paraphrase").post(requireSignin, checkFreePlanUsage, paraphrase);

module.exports = router;
