const express = require("express");
const router = express.Router();
const {
  getCollections, getCollectionById, createCollection, updateCollection, deleteCollection,
} = require("../controllers/collectionController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/", getCollections);
router.get("/:id", getCollectionById);
router.post("/", protect, adminOnly, createCollection);
router.put("/:id", protect, adminOnly, updateCollection);
router.delete("/:id", protect, adminOnly, deleteCollection);

module.exports = router;
