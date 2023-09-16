const express = require("express");
const router = express.Router();

import { isAdmin } from "../middlewares";
const {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  getSubscribedUsers,
  getUnsubscribedUsers,
  promoteUserToAdmin,
  demoteAdminToUser,
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

// Endpoint to change a user's role to admin
router.put("/promote/:userId", isAdmin, promoteUserToAdmin);

// Endpoint to change an admin's role to user
router.put("/demote/:userId", isAdmin, demoteAdminToUser);

module.exports = router;
