const User = require("../models/userData");

exports.createUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(req.body);
    const user = new User({
      userId: userId,
      name: req.body.name,
      age: req.body.age,

      profilePicture: req.files.profilePicture
        ? req.files.profilePicture[0].path
        : null,

      workExperiences: req.body.workExperiences.map((experience) => ({
        startDate: experience.startDate,
        endDate: experience.endDate,
        current: experience.current,
        jobTitle: experience.jobTitle,
        company: experience.company,
        companyLogo: experience.companyLogo
          ? experience.companyLogo[0].path
          : null,
      })),
    });

    await user.save();

    res.status(201).json({ message: "Profile data saved successfully" });
  } catch (error) {
    console.error("Error saving profile data:", error);
    res.status(500).json({ message: "Server error" });
  }
};
