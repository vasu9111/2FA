import express from "express";
import authController from "./auth.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
  "/get-qr",
  authMiddleware.intermediateTokenVerify,
  authController.get2FAQrData
);
router.post(
  "/verify-2FA-on-App",
  authMiddleware.intermediateTokenVerify,
  authController.verified2FAOnApp
);

router.get(
  "/send-2FA-on-email",
  authMiddleware.intermediateTokenVerify,
  authController.send2FAOnEmail
);

router.post(
  "/verify-2FA-by-email",
  authMiddleware.intermediateTokenVerify,
  authController.verify2FAByEmail
);

router.get("/homepage", authMiddleware.verify, authController.homepage);

export default router;
