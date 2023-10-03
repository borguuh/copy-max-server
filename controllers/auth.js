import User from "../models/user";
import { hashPassword, comparePassword } from "../utils/auth";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import AWS from "aws-sdk";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const SES = new AWS.SES(awsConfig);

export const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { name, email, password } = req.body;
    // validation
    if (!name) return res.status(400).send("Name is required");
    if (!password || password.length < 6) {
      return res
        .status(400)
        .send("Password is required and should be min 6 characters long");
    }
    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send("Email is taken");

    // hash password
    const hashedPassword = await hashPassword(password);

    // Generate a verification code
    const verificationCode = await nanoid(6).toUpperCase();

    // register
    const user = new User({
      name,
      email,
      password: hashedPassword,
      emailVerificationCode: verificationCode, // Store the verification code in the user document
      emailVerified: false,
    });
    await user.save();

    // Prepare the email for sending
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
              <html>
                <h1>Email Verification Code</h1>
                <p>Please use this code to verify your email:</p>
                <h2 style="color:red;">${verificationCode}</h2>
                <i>app.copymax.io</i>
              </html>
            `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Email Verification Code",
        },
      },
    };

    // Send the email with the verification code
    await SES.sendEmail(params).promise();

    // Send a response to the frontend
    return res.status(200).json({
      message:
        "Registration successful. Check your email for the verification code.",
    });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const verifySignup = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;

    // Find the user by their email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided verification code matches the stored code
    if (user.emailVerificationCode === verificationCode) {
      // Update the user's email verification status to true
      user.emailVerified = true;

      // Clear the email verification code as it's no longer needed
      user.emailVerificationCode = "";

      // Save the updated user document
      await user.save();

      return res.status(200).json({
        message: "Email verification successful. You can now log in.",
      });
    } else {
      return res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, password } = req.body;
    // check if our db has user with that email
    const user = await User.findOne({ email }).exec();
    if (!user) return res.status(400).send("No user found");
    // check password
    const match = await comparePassword(password, user.password);
    if (!match) return res.status(400).send("Wrong password");

    // generate a 6-digit code
    const shortCode = nanoid(6).toUpperCase();

    // Update the user with the generated code
    user.twoFactorCode = shortCode;
    await user.save();

    // Prepare the email for sending
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Two-Factor Authentication Code</h1>
                  <p>Use this code to confirm log in:</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>app.copymax.io</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Two-Factor Authentication Code",
        },
      },
    };

    // Send the email with the code
    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        req.twoFactorAuthCode = shortCode; // Store the code in the request for later verification
        // If the email is sent successfully, send a response to the frontend
        return res.status(200).json({
          message:
            "Please check your email for the Two Factor Authentication Code.",
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ message: "Failed to send 2FA code via email" });
      });
    // create signed jwt
    // const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    //   expiresIn: "7d",
    // });
    // // return user and token to client, exclude hashed password
    // user.password = undefined;
    // // send token in cookie

    // res.cookie("token", token, {
    //   sameSite: "none",
    //   secure: process.env.NODE_ENV !== "development", // only works on https
    //   expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
    //   maxAge: 24 * 60 * 60 * 1000, // 24 hours
    // });
    // // send user as json response
    // res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error. Try again.");
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "Signout success" });
  } catch (err) {
    console.log(err);
  }
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").exec();
    console.log("CURRENT_USER", user);
    return res.json(user);
  } catch (err) {
    console.log(err);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email },
      { passwordResetCode: shortCode }
    );
    if (!user) return res.status(400).send("User not found");

    // prepare for email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Reset password</h1>
                  <p>Please use this code to reset your password</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>app.copymax.io</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Reset Password",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    // console.table({ email, code, newPassword });
    const hashedPassword = await hashPassword(newPassword);

    const user = User.findOneAndUpdate(
      {
        email,
        passwordResetCode: code,
      },
      {
        password: hashedPassword,
        passwordResetCode: "",
      }
    ).exec();
    res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};

export const getSubscription = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ subscription: user.subscription });
  } catch (err) {
    next(err);
  }
};

export const getCustomer = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({ customerId: user.customerId });
  } catch (err) {
    next(err);
  }
};

export const emailLogin = async (req, res) => {
  try {
    const { email } = req.body;
    // console.log(email);
    const shortCode = nanoid(6).toUpperCase();
    const user = await User.findOneAndUpdate(
      { email: email },
      { emailCode: shortCode }
    );
    if (!user) return res.status(404).send("User not found");

    // prepare for email
    const params = {
      Source: process.env.EMAIL_FROM,
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `
                <html>
                  <h1>Login short code </h1>
                  <p> Please use this code to login to your account</p>
                  <h2 style="color:red;">${shortCode}</h2>
                  <i>app.copymax.io</i>
                </html>
              `,
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: "Login Code",
        },
      },
    };

    const emailSent = SES.sendEmail(params).promise();
    emailSent
      .then((data) => {
        console.log(data);
        res.json({ ok: true });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

export const verifyEmail = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, code } = req.body;

    // check password
    const user = User.findOneAndUpdate(
      {
        email,
        emailCode: code,
      },
      {
        emailCode: "",
      }
    ).exec();
    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    // send token in cookie

    res.cookie("token", token, {
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development", // only works on https
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    // send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};

export const enableTwoFactorAuth = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if 2FA is already enabled for the user
    if (user.twoFactorAuthEnabled) {
      return res.status(400).json({
        message: "Two-Factor Authentication is already enabled for this user",
      });
    }

    user.twoFactorAuthEnabled = true;

    // Save the user document with the updated 2FA information
    await user.save();

    return res.status(200).json({
      message: "Two-Factor Authentication has been enabled for this user",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const disableTwoFactorAuth = async (req, res) => {
  try {
    // Find the user by their ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if 2FA is already enabled for the user
    if (!user.twoFactorAuthEnabled) {
      return res.status(400).json({
        message: "Two-Factor Authentication is already disabled for this user",
      });
    }

    user.twoFactorAuthEnabled = false;

    // Save the user document with the updated 2FA information
    await user.save();

    return res.status(200).json({
      message: "Two-Factor Authentication has been disabled for this user",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const twoFactorAuth = async (req, res) => {
  try {
    // console.log(req.body);
    const { email, code } = req.body;

    // check code
    const user = await User.findOneAndUpdate(
      {
        email,
        twoFactorCode: code,
      },
      {
        twoFactorCode: "",
      }
    ).exec();

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found or invalid code" });
    }

    // create signed jwt
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // return user and token to client, exclude hashed password
    user.password = undefined;
    user.emailVerificationCode = undefined;
    user.twoFactorCode = undefined;

    // twoFactorCode
    // send token in cookie

    res.cookie("token", token, {
      sameSite: "none",
      secure: process.env.NODE_ENV !== "development", // only works on https
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    });
    // send user as json response
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Error! Try again.");
  }
};
