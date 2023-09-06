const express = require("express");
const router = express.Router();

const {
  businessPlan,
  marketingPlan,
  tweet,
  quote,
  proposal,
  instaCaption,
  invoice,
} = require("../controllers/openai");

router.route("/business").post(businessPlan);
router.route("/marketingPlan").post(marketingPlan);
router.route("/tweet").post(tweet);
router.route("/quote").post(quote);
router.route("/proposal").post(proposal);
router.route("/insta").post(instaCaption);
router.route("/invoice").post(invoice);

module.exports = router;
