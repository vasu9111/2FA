import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userDb from "../db/userDb.js";

const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      const errorMessage = [];
      for (let detail of error.details) {
        errorMessage.push(detail.message);
      }
      res.status(400).json({ error: errorMessage });
    }
  };
};

const { accessTokenKey } = config.jwt;
const isLoggedIn = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    next(new Error("Token is required"));
  }
  try {
    const decoded = jwt.verify(token, accessTokenKey);
    const userData = await userDb.findUserById(decoded.id);
    userData.is2FAVerified = decoded.isTwoFactorVerified;
    req.user = userData;
    next();
  } catch (err) {
    return next(err);
  }
};
const intermediateTokenVerify = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    next(new Error("Token is required"));
  }
  try {
    const decoded = jwt.verify(token, config.intermediateTokenKey);

    const userData = await userDb.findUserById(decoded.id);

    req.user = userData;

    next();
  } catch (err) {
    return next(err);
  }
};

// is2FAVerified
export const is2FAVerified = (req, res, next) => {
  try {
    const { is2FAVerified } = req.user;
    if (!is2FAVerified) {
      throw new Error("2FA verification required");
    }
    next();
  } catch (err) {
    return next(err);
  }
};

export default {
  isLoggedIn,
  intermediateTokenVerify,
  validate,
  is2FAVerified,
};
