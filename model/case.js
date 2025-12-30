const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const caseSchema = new Schema({
    lawyerId: {
        type: Schema.Types.ObjectId,
        ref: 'Lawyer',
        required: true
    },
    caseType: { type: String, required: true },
    courtType: { type: String, required: true },
    caseNumber: { type: String, required: true },
    petitioner: { type: String, required: true },
    respondent: { type: String, required: true },
    stage: { type: String, required: true },
    nextHearingDate: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    courtFee: { type: Number, required: false },
    status: { type: String, required: true },
    affidavitId: { type: Number, required: false },
    vakalatnamaNumber : {type : Number, required : false}
});

const Case = mongoose.model("Case", caseSchema);
module.exports = Case;