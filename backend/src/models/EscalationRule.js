const mongoose = require("mongoose");

const escalationRuleSchema = new mongoose.Schema(
  {
    triggerEvent: {
      type: String,
      required: true,
    },

    daysThreshold: {
      type: Number,
      required: true,
    },

    notifyChain: [
      {
        type: String,
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "EscalationRule",
  escalationRuleSchema
);