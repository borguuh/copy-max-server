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
    if (user.subscription === "free" && daysDifference >= 14) {
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

// export const checkTwoFactorAuth = async (req, res, next) => {
//   try {
//     const { email } = req.body;

//     // Check if the user with the provided email exists
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     // Check if 2FA is enabled for the user
//     if (user.twoFactorAuthEnabled) {
//       // If 2FA is enabled, generate a 6-digit code
//       const shortCode = nanoid(6).toUpperCase();

//       // Update the user's passwordResetCode field with the generated code
//       user.twoFactorCode = shortCode;
//       await user.save();

//       // Prepare the email for sending
//       const params = {
//         Source: process.env.EMAIL_FROM,
//         Destination: {
//           ToAddresses: [email],
//         },
//         Message: {
//           Body: {
//             Html: {
//               Charset: "UTF-8",
//               Data: `
//                 <html>
//                   <h1>Two-Factor Authentication Code</h1>
//                   <p>Use this code to log in:</p>
//                   <h2 style="color:red;">${shortCode}</h2>
//                   <i>app.copymax.io</i>
//                 </html>
//               `,
//             },
//           },
//           Subject: {
//             Charset: "UTF-8",
//             Data: "Two-Factor Authentication Code",
//           },
//         },
//       };

//       // Send the email with the code
//       const emailSent = SES.sendEmail(params).promise();
//       emailSent
//         .then((data) => {
//           req.twoFactorAuthCode = shortCode; // Store the code in the request for later verification
//           // If the email is sent successfully, send a response to the frontend
//           return res.status(200).json({
//             message:
//               "Please check your email for the Two Factor Authentication Code.",
//           });
//         })
//         .catch((err) => {
//           console.error(err);
//           res
//             .status(500)
//             .json({ message: "Failed to send 2FA code via email" });
//         });
//     } else {
//       // If 2FA is not enabled, proceed with login
//       next();
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const checkEmailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user's email has been verified
    if (!user.emailVerified) {
      return res.status(401).json({
        message:
          "Email not verified. Please check your email for the verification code.",
      });
    }

    // If the email is verified, proceed with login
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
