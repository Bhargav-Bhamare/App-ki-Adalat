const mongoose = require("mongoose");
const Case = require("../model/case");
const sampleCases = require("./caseData.js");

async function initializeDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/NyaayDrishti");
    console.log("Connected to MongoDB");

    // Check if cases already exist
    const existingCases = await Case.countDocuments();
    if (existingCases === 0) {
      // Insert sample cases
      await Case.insertMany(sampleCases);
      console.log("Sample cases inserted successfully.");
    } else {
      console.log("Cases already exist in the database.");
    }
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initializeDatabase();