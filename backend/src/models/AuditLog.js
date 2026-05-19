const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    tableName: {
      type: String,
      required: true,
    },

    recordId: {
      type: String,
      required: true,
    },

    action: {
      type: String,
      enum: ["UPDATE", "DELETE", "UNLOCK"],
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    oldData: {
      type: Object,
    },

    newData: {
      type: Object,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);