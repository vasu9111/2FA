import express from "express";
import authController from "./auth.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import authValidation from "./auth.validation.js";
const router = express.Router();

router.post(
  "/register",
  authMiddleware.validate(authValidation.registerUser),
  authController.register
);
router.post(
  "/login",
  authMiddleware.validate(authValidation.loginUser),
  authController.login
);
router.get(
  "/get-qr",
  authMiddleware.intermediateTokenVerify,
  authController.get2FAQrData
);

router.post(
  "/send-2FA-on-App",
  authMiddleware.intermediateTokenVerify,
  authController.send2FAOnApp
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

router.get("/homepage", authMiddleware.isLoggedIn, authController.homepage);
router.post(
  "/list",
  authMiddleware.isLoggedIn,
  authMiddleware.is2faDone,
  authController.privateList
);
export default router;
