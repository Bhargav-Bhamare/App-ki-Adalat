const mongoose = require("mongoose");
const passportLocalMongoosePkg = require("passport-local-mongoose");
const passportLocalMongoose =
  passportLocalMongoosePkg.default || passportLocalMongoosePkg;

const lawyerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    username: {
      type: String,
      required: true,
      trim: true
    },
    mobile: {
      type: String,
      trim: true
    },
    BarCouncilRegistrationNumber: {
      type: Number,
      required: true,
      unique: true
    },
    specializations: [String],
    courts: [String],
    totalCases: {
      type: Number,
      default: 0
    },
    activeCases: {
      type: Number,
      default: 0
    },
    disposedCases: {
      type: Number,
      default: 0
    },
    successRate: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    role: {
      type: String,
      enum: ['LAWYER', 'JUDGE', 'COURTMASTER'],
      default: 'LAWYER'
    },
    vakalatnamaValidity: Date,
    profilePicture: String
  },
  { timestamps: true }
);

// Use email as the authentication field
lawyerSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model("Lawyer", lawyerSchema);
