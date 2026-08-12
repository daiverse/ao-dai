const asyncHandler = require("express-async-handler");
const Collection = require("../models/Collection");

const getCollections = asyncHandler(async (req, res) => {
  const collections = await Collection.find({ isActive: true });
  res.json({ success: true, data: collections });
});

const getCollectionById = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({ $or: [{ _id: req.params.id }, { id: req.params.id }] });
  if (!collection) { res.status(404); throw new Error("Không tìm thấy bộ sưu tập."); }
  res.json({ success: true, data: collection });
});

const createCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.create(req.body);
  res.status(201).json({ success: true, message: "Tạo bộ sưu tập thành công!", data: collection });
});

const updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!collection) { res.status(404); throw new Error("Không tìm thấy bộ sưu tập."); }
  res.json({ success: true, message: "Cập nhật thành công!", data: collection });
});

const deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) { res.status(404); throw new Error("Không tìm thấy bộ sưu tập."); }
  collection.isActive = false;
  await collection.save();
  res.json({ success: true, message: "Đã xóa bộ sưu tập." });
});

module.exports = { getCollections, getCollectionById, createCollection, updateCollection, deleteCollection };
