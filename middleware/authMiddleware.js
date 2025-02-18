import jwt from "jsonwebtoken";
import config from "../config/config.js";
import userMdl from "../model/user.js";

const { accessTokenKey } = config.jwt;
const verify = async (req, res, next) => {
  let token;
  const authToken = req.headers["authorization"];
  if (authToken && authToken.startsWith("Bearer ")) {
    token = authToken.split(" ")[1];
  }

  if (!token) {
    next(new Error("Token is required"));
  }

  try {
    const decoded = jwt.verify(token, accessTokenKey);
    const userData = await userMdl.findById(decoded._id);
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
  let token;
  const authToken = req.headers["authorization"];
  if (authToken && authToken.startsWith("Bearer ")) {
    token = authToken.split(" ")[1];
  }

  if (!token) {
    next(new Error("Token is required"));
  }
  try {
    const decoded = jwt.verify(token, config.INTERMEDIATE_TOKEN_KEY);

    const userData = await userMdl.findById(decoded.id);

    req.user = userData;

    next();
  } catch (err) {
    return next(err.message);
  }
};
export default {
  verify,
  intermediateTokenVerify,
};
