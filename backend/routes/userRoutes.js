const express = require("express");
const router = express.Router();
const {
  getProfile, updateProfile, changePassword,
  toggleWishlist, getAllUsers, toggleUserActive,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.post("/wishlist/:productId", protect, toggleWishlist);

// Admin routes
router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/toggle-active", protect, adminOnly, toggleUserActive);

module.exports = router;
