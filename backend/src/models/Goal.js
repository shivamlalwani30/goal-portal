const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    weightage: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "pending",
    },

    progress: {
      type: Number,
      default: 0,
    },

    assignedTo: {
      type: String,
      required: true,
    },

    assignedBy: {
      type: String,
      required: true,
    },

    priority: {
      type: String,
      default: "medium",
    },

    deadline: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Goal",
  goalSchema
);