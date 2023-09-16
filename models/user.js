import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

// 2FA, stripe payment, sendgrid,
// CRUD for generated contents
// profile image upload
// search

// C
// R
// U
// D for User -don't fully delete user profile

// -------------
// C
// R
// *U *D for peojects
// upload picture
// delete project req - method
// update project request - also rerun prompt
// update -  role unavailable

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    education: {
      type: String,
    },
    languages: {
      type: String,
    },
    department: {
      type: String,
    },
    organization: {
      type: String,
    },
    dob: {
      type: Date,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 6,
      max: 64,
      select: false,
    },
    emailCode: {
      data: String,
      default: "",
      select: false,
    },
    image: {},
    picture: {
      type: String,
      default: "/avatar.png",
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "dev", "admin"],
    },
    customerId: {
      type: String,
      default: "",
    },
    subscription: {
      type: String,
      default: "free",
      enum: ["free", "lite", "pro", "elite"],
    },
    passwordResetCode: {
      data: String,
      default: "",
      select: false,
    },
    stripe_account_id: "",
    stripe_seller: {},
    stripeSession: {},
    projects: [{ type: ObjectId, ref: "Project" }],
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
