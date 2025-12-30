const Case = require("../model/case");

const generateDiaryNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Case.countDocuments();
  return `DN/${year}/${String(count + 1).padStart(4, "0")}`;
};

exports.fileCase = async (req, res) => {
  try {
    const diaryNumber = await generateDiaryNumber();

    const newCase = await Case.create({
      diaryNumber,
      filedBy: req.user._id,
      caseType: req.body.caseType,

      scrutinyStatus: "PENDING",
      stage: "FRESH",
      status: "ACTIVE"
    });

    res.status(201).json({
      message: "Case filed successfully",
      diaryNumber: newCase.diaryNumber
    });
  } catch (error) {
    console.error("CASE FILING ERROR:", error);
    res.status(500).json({ error: "Failed to file case" });
  }
};
