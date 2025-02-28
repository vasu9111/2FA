import express from "express";
import authRoute from "./components/auth/auth.route.js";
const router = express.Router();

router.use("/auth", authRoute);

export default router;
