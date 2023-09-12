import User from "../models/user";
import Project from "../models/project";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    // Fetch all users from the database, excluding password and passwordResetCode
    const users = await User.find({}, "-password -passwordResetCode").sort({
      updatedAt: -1,
    });

    // Count the total number of users in the collection
    const totalUsers = await User.countDocuments();

    res.status(200).json({ totalUsers, users });
  } catch (error) {
    console.error(error);
    return res.status(400).send("Getting all users failed");
  }
};

//

export const getSubscribedUsers = async (req, res) => {
  try {
    // Find users with the role "pro"
    const subscribedUsers = await User.find(
      { role: "pro" },
      "-password -passwordResetCode"
    );

    res.status(200).json(subscribedUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getUnsubscribedUsers = async (req, res) => {
  try {
    // Find users with the role "user"
    const unsubscribedUsers = await User.find(
      { role: "user" },
      "-password -passwordResetCode"
    );

    res.status(200).json(unsubscribedUsers);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

// Get specific user profile
export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Fetch the user by their ID, excluding password and passwordResetCode
    const user = await User.findById(userId, "-password -passwordResetCode");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedProfile = req.body;

    // Use findByIdAndUpdate to update the user's profile based on their ID
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updatedProfile,
      { new: true, fields: "-password -passwordResetCode" } // Return the updated user excluding sensitive fields
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

// Delete user profile
export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Use findByIdAndRemove to delete the user based on their ID
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send(); // 204 No Content status for a successful deletion
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

// Find all projects
