import express from "express";
import { uploadImage } from "../controllers/uploadController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  uploadImage
);

export default router;
