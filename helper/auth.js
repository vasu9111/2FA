import jwt from "jsonwebtoken";
import config from "../config/config.js";
import user from "../model/user.js";

const intermediateToken = async (id) => {
  try {
    const userFound = await user.findById(id);
    if (!userFound) {
      throw new Error("User not found");
    }
    const intermediateToken = jwt.sign(
      { id, email: userFound.email },
      config.INTERMEDIATE_TOKEN_KEY,
      { expiresIn: `${config.INTERMEDIATE_TOKEN_EXPIRY}m` }
    );

    return intermediateToken;
  } catch (err) {
    throw new Error(err.message);
  }
};
const generateAccessAndRefreshToken = async (id, isTwoFactorVerified) => {
  try {
    const userFound = await user.findById(id);
    if (!userFound) {
      throw new Error("User not found");
    }
    const accessToken = jwt.sign(
      { id, email: userFound.email, isTwoFactorVerified },
      config.jwt.accessTokenKey,
      { expiresIn: `${config.jwt.accessTokenExpiry}m` }
    );
    const refreshToken = jwt.sign(
      { id, email: userFound.email, isTwoFactorVerified },
      config.jwt.accessTokenKey,
      { expiresIn: `${config.jwt.accessTokenExpiry}m` }
    );

    return { accessToken, refreshToken };
  } catch (err) {
    throw new Error(err.message);
  }
};

const generateOtp = () => {
  const digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export default {
  intermediateToken,
  generateAccessAndRefreshToken,
  generateOtp,
};
