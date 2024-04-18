const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const firstName = req.body.name.split(" ")[0];

    const lastFourDigits = req.params.userId.slice(-4);

    const ext = path.extname(file.originalname);

    const fileName = `${firstName}${lastFourDigits}${ext}`;

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/shareProfile/:userId", userController.shareProfile);

router.post(
  "/submitProfile/:userId",
  upload.single("profilePicture"),
  userController.saveOrUpdateUserData
);

router.post(
  "/deleteWorkExperience/:userId",
  userController.deleteWorkExperience
);

router.get("/getUserData/:userId", userController.getUserData);
router.get("/getWorkExperience/:userId/:id", userController.getWorkExperience);
router.get("/getSharedUser/:userId", userController.getSharedUser);

module.exports = router;
