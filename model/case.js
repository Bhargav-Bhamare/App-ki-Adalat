// const mongoose = require("mongoose");
// const Schema = mongoose.Schema;

// const caseSchema = new Schema({
//     caseType: { type: String, required: true },
//     courtType: { type: String, required: true },
//     caseNumber: { type: String, required: true },
//     petitioner: { type: String, required: true },
//     respondent: { type: String, required: true },
//     stage: { type: String, required: true },
//     nextHearingDate: { type: Date, required: true },
//     timeSlot: { type: String, required: true },
//     courtFee: { type: Number, required: false },
//     status: { type: String, required: true },
//     affidavitId: { type: Number, required: false },
//     vakalatnamaNumber : {type : Number, required : false}
// });

// const Case = mongoose.model("Case", caseSchema);
// module.exports = Case;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const caseSchema = new Schema(
  {
    // 🔹 Phase 2 Core Identifiers
    diaryNumber: {
      type: String,
      required: true,
      unique: true,
    },

    caseNumber: {
      type: String,
      default: null, // generated after scrutiny approval
    },

    cnrNumber: {
      type: String,
      default: null,
    },

    // 🔹 Who filed the case
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Case basic classification
    caseType: {
      type: String,
      required: true,
    },

    // 🔹 Phase 2 Workflow State
    scrutinyStatus: {
      type: String,
      enum: ["PENDING", "UNDER_OBJECTION", "APPROVED"],
      default: "PENDING",
    },

    stage: {
      type: String,
      default: "FRESH",
    },

    status: {
      type: String,
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);
