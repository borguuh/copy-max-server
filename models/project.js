import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const projectSchema = new mongoose.Schema(
  {
    type: {
      type: [String],
      enum: [
        "business",
        "marketing",
        "tweet",
        "quote",
        "proposal",
        "insta",
        "invoice",
        "linkedin",
        "ads",
        "paraphrase",
      ],
    },
    name: {
      type: String,
    },
    prompt: {},
    response: {
      type: String,
    },
    creator: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);

// 2FA, CRUD for Profile (admin and user), stripe payment, sendgrid,
// CRUD for generated contents
// profile image upload
// search

// C
// R
// UD for User

// -------------
// C
// R
// *U *D for peojects
//
