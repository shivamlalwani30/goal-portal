const mongoose = require("mongoose");

const checkinSchema = new mongoose.Schema(
  {
    goal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
    },

    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
    },

    progress: {
      type: Number,
      default: 0,
    },

    employeeNote: {
      type: String,
    },

    managerComment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkin", checkinSchema);