const mongoose = require("mongoose");

const goalSheetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    cycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoalCycle",
    },

    status: {
      type: String,
      enum: ["draft", "submitted", "approved", "returned"],
      default: "draft",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GoalSheet", goalSheetSchema);