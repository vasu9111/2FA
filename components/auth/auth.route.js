import express from "express";
import authController from "./auth.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";
import authValidation from "./auth.validation.js";
const router = express.Router();

router.post(
  "/register",
  authMiddleware.validate(authValidation.registerUser),
  authController.registerUser
);
router.post(
  "/login",
  authMiddleware.validate(authValidation.loginUser),
  authController.loginUser
);
router.get(
  "/get-qr",
  authMiddleware.intermediateTokenVerify,
  authController.generateQrFor2FA
);

router.post(
  "/send-2FA-on-App",
  authMiddleware.validate(authValidation.code),
  authMiddleware.intermediateTokenVerify,
  authController.verify2FAOnApp
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
  authMiddleware.is2FAVerified,
  authController.privateList
);
export default router;
