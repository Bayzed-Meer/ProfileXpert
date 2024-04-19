const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const multer = require("multer");
const path = require("path");

// Multer storage configuration for handling file uploads
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

// Profile routes
router.get("/getProfile/:userId", userController.getProfile);
router.post(
  "/createProfile/:userId",
  upload.single("profilePicture"),
  userController.createProfile
);
router.patch(
  "/updateProfile/:userId",
  upload.single("profilePicture"),
  userController.updateProfile
);

// Work experience routes
router.get("/getWorkExperience/:userId/:id", userController.getWorkExperience);
router.post("/addWorkExperience/:userId", userController.addWorkExperience);
router.patch(
  "/updateWorkExperience/:userId/:id",
  userController.updateWorkExperience
);
router.delete(
  "/deleteWorkExperience/:userId/:id",
  userController.deleteWorkExperience
);

// Sharing profile route
router.get("/getSharedUser/:userId", userController.getSharedUser);
router.post("/shareProfile/:userId", userController.shareProfile);

module.exports = router;
