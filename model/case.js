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

const caseSchema = new Schema({
    // 🔹 Who filed the case
    lawyerId: {
        type: Schema.Types.ObjectId,
        ref: 'Lawyer',
        required: true
    },
    
    filedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔹 Case identification
    caseNumber: {
      type: String,
      default: null, // generated after scrutiny approval
    },

    cnrNumber: {
      type: String,
      default: null,
    },

    // 🔹 Case basic information
    caseType: { 
        type: String, 
        required: true 
    },
    
    courtType: { 
        type: String, 
        required: true 
    },
    
    petitioner: { 
        type: String, 
        required: true 
    },
    
    respondent: { 
        type: String, 
        required: true 
    },

    // 🔹 Case workflow and status
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

    // 🔹 Hearing details
    nextHearingDate: { 
        type: Date, 
        required: false 
    },
    
    timeSlot: { 
        type: String, 
        required: false 
    },

    // 🔹 Financial and document details
    courtFee: { 
        type: Number, 
        required: false 
    },
    
    affidavitId: { 
        type: Number, 
        required: false 
    },
    
    vakalatnamaNumber: { 
        type: Number, 
        required: false 
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model("Case", caseSchema);
