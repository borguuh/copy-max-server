import expressJwt from "express-jwt";
import User from "../models/user";

export const requireSignin = expressJwt({
  getToken: (req, res) => {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"];
    console.log(token);
    return token;
  },
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});

export const checkFreePlanUsage = async (req, res, next) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate the difference in days between the createdAt date and the current date
    const createdAt = user.createdAt;
    const currentDate = new Date();
    const timeDifference = Math.abs(currentDate - createdAt);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // Check if the user is on the "free" plan and has used up to three days
    if (user.subscription === "free" && daysDifference >= 3) {
      return res
        .status(403)
        .json({ message: "Please upgrade to a paid plan to continue" });
    }

    // If the user is still within the three days or not on the "free" plan, proceed to the next middleware
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user's role is either "admin" or "dev"
    if (user.role === "admin" || user.role === "dev") {
      // User has admin or dev role, allow access
      next();
    } else {
      // User is not authorized to perform the action
      return res.status(403).json({
        message:
          "You are not permitted to perform this action. Admin access is required.",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
