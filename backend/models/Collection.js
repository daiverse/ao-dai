const mongoose = require("mongoose");

const collectionSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên bộ sưu tập"],
      trim: true,
    },
    subtitle: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    priceFrom: {
      type: String,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
    },
    accentColor: {
      type: String,
      default: "#D4A373",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Collection", collectionSchema);
