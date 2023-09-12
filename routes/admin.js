const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  getSubscribedUsers,
  getUnsubscribedUsers,
} = require("../controllers/admin"); // Replace with the actual path to your controller file

// Route for getting all users
router.get("/users", getAllUsers);

// Route for getting a specific user by ID
router.get("/users/:userId", getUserById);

// Route for updating a user's profile
router.put("/users/:userId", updateUserProfile);

// Route for deleting a user
router.delete("/users/:userId", deleteUser);

// Route for getting subscribed users
router.get("/subscribed-users", getSubscribedUsers);

// Route for getting unsubscribed users
router.get("/unsubscribed-users", getUnsubscribedUsers);

module.exports = router;
