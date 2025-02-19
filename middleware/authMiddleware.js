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
    const userData = await userDb.findByUserId(decoded.id);
    req.user = userData;
    next();
  } catch (err) {
    const error = new Error(err.message);
    error.code = err.code || "SERVER_ERROR";
    error.status = err.status || 500;
    return next(error);
  }
};
const intermediateTokenVerify = async (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    next(new Error("Token is required"));
  }
  try {
    const decoded = jwt.verify(token, config.INTERMEDIATE_TOKEN_KEY);

    const userData = await userDb.findByUserId(decoded.id);

    req.user = userData;

    next();
  } catch (err) {
    return next(err.message);
  }
};

const is2faDone = async (req, res, next) => {
  try {
    const userFound = await userDb.findByUserId(req.user._id);
    if (!userFound) {
      throw new Error("User not found");
    }
    if (
      userFound.twoFactorMode !== "APP" &&
      userFound.twoFactorMode !== "EMAIL"
    ) {
      throw new Error("is 2fa not a done");
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
  is2faDone,
};
