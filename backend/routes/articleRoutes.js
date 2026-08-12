const express = require("express");
const router = express.Router();
const {
  getArticles, getArticleBySlug, createArticle, updateArticle, deleteArticle,
} = require("../controllers/articleController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);
router.post("/", protect, adminOnly, createArticle);
router.put("/:id", protect, adminOnly, updateArticle);
router.delete("/:id", protect, adminOnly, deleteArticle);

module.exports = router;
