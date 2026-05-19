const mongoose = require("mongoose");

const thrustAreaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    cycle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoalCycle",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ThrustArea", thrustAreaSchema);