const UserData = require("../models/userData");
const User = require("../models/user");

exports.saveOrUpdateUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    let userData = await UserData.findOne({ userId: userId });

    if (!userData) {
      userData = new UserData({
        userId: userId,
        name: req.body.name,
        designation: req.body.designation,
        age: req.body.age,
        profileSummary: req.body.profileSummary,
        profilePicture: req.file ? req.file.path : "",
        workExperiences: [],
      });
    } else {
      userData.name = req.body.name ? req.body.name : userData.name;
      userData.age = req.body.age ? req.body.age : userData.age;
      userData.profileSummary = req.body.profileSummary
        ? req.body.profileSummary
        : userData.profileSummary;
      userData.designation = req.body.designation
        ? req.body.designation
        : userData.designation;
      userData.profilePicture = req.file
        ? req.file.path
        : userData.profilePicture;

      if (req.body.startDate) {
        userData.workExperiences.push({
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          current: req.body.current,
          jobTitle: req.body.jobTitle,
          company: req.body.company,
          jobDescription: req.body.jobDescription,
        });
      }
    }

    await userData.save();

    res
      .status(200)
      .json({ message: "Profile data saved/updated successfully" });
  } catch (error) {
    console.log(error);

    if (error.name === "ValidationError") {
      let validationErrors = [];
      for (let field in error.errors) {
        validationErrors.push(error.errors[field].message);
      }
      return res
        .status(400)
        .json({ message: "Validation error", errors: validationErrors });
    }
    console.error("Error saving/updating profile data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserData = async (req, res) => {
  try {
    const { userId } = req.params;
    const userData = await UserData.findOne({ userId: userId });

    if (!userData) {
      return res.status(204).json({ message: "User data not found" });
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSharedUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const sharedUser = user.sharedWithMe.map((sharedUser) => ({
      userId: sharedUser.userId,
      username: sharedUser.username,
    }));

    return res.status(200).json(sharedUser);
  } catch (error) {
    console.error("Error fetching shared user data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getWorkExperience = async (req, res) => {
  try {
    const { userId, id } = req.params;
    const userData = await UserData.findOne({ userId: userId });

    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    const workExperience = userData.workExperiences.find(
      (exp) => exp._id.toString() === id
    );

    if (!workExperience) {
      return res.status(404).json({ message: "Work experience not found" });
    }

    res.status(200).json(workExperience);
  } catch (error) {
    console.error("Error fetching work experience data:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.shareProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const senderId = req.params.userId;

    const receiver = await User.findOne({ email });

    if (!receiver) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    const sender = await User.findById(senderId);

    if (!sender) {
      return res.status(404).json({ message: "Sender user not found" });
    }

    if (receiver.email === sender.email) {
      return res
        .status(400)
        .json({ message: "You cannot share your profile with yourself" });
    }

    await User.updateOne(
      { _id: receiver._id },
      {
        $addToSet: {
          sharedWithMe: {
            userId: senderId,
            username: sender.username,
          },
        },
      }
    );

    res.status(200).json({ message: "Profile shared successfully" });
  } catch (error) {
    console.error("Error sharing profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteWorkExperience = async (req, res) => {
  try {
    const { userId } = req.params;
    const { id } = req.body;

    const userData = await UserData.findOne({ userId: userId });

    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    const index = userData.workExperiences.findIndex(
      (exp) => exp._id.toString() === id
    );

    if (index === -1) {
      return res.status(404).json({ message: "Work experience not found" });
    }

    userData.workExperiences.splice(index, 1);

    await userData.save();

    res.status(200).json({ message: "Work experience deleted successfully" });
  } catch (error) {
    console.error("Error deleting work experience:", error);
    res.status(500).json({ message: "Server error" });
  }
};
