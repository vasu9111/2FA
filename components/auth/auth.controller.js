import authService from "./auth.service.js";
import auth from "../../helper/auth.js";
const registerUser = async (req, res, next) => {
  try {
    const registerUser = await authService.registerUser(req.body);
    res.status(200).json(registerUser);
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const loginUser = await authService.loginUser(req.body);
    delete loginUser.userData.password;

    if (loginUser.userData.is2FAEnabled) {
      loginUser.intermediateToken = await auth.intermediateToken(
        loginUser.userData._id
      );
    } else {
      const tokens = await auth.generateAccessAndRefreshToken(
        loginUser.userData._id
      );
      loginUser.accessToken = tokens.accessToken;
      loginUser.refreshToken = tokens.refreshToken;
    }
    res.status(200).json(loginUser);
  } catch (error) {
    console.log(error);

    next(error);
  }
};

const generateQrFor2FA = async (req, res, next) => {
  try {
    const qrData = await authService.generateQrFor2FA(req.query.email);
    res.status(200).json(qrData);
  } catch (error) {
    next(error);
  }
};

const verify2FAOnApp = async (req, res, next) => {
  try {
    const Data = await authService.verify2FAOnApp(
      req.body.secret,
      req.body.code,
      req.user._id
    );
    res.status(200).json(Data);
  } catch (err) {
    next(new Error(err.message));
  }
};

const verified2FAOnApp = async (req, res, next) => {
  try {
    const result = await authService.verified2FAOnApp(
      req.body.code,
      req.user._id
    );
    res.status(200).json(result);
  } catch (err) {
    next(new Error(err.message));
  }
};
const send2FAOnEmail = async (req, res, next) => {
  try {
    const Data = await authService.send2FAOnEmail(
      req.user.email,
      req.user._id,
      req.user.fname
    );
    res.status(200).json(Data);
  } catch (err) {
    next(new Error(err.message));
  }
};

const verify2FAByEmail = async (req, res, next) => {
  try {
    const Data = await authService.verify2FAByEmail(
      req.user.email,
      req.body.otp,
      req.user._id
    );
    res.status(200).json(Data);
  } catch (err) {
    next(new Error(err.message));
  }
};

const homepage = async (req, res, next) => {
  try {
    const page = await authService.homepage();
    res.json(page);
  } catch (err) {
    next(new Error(err.message));
  }
};

const privateList = async (req, res, next) => {
  try {
    const result = await authService.privateList();
    res.status(200).json(result);
  } catch (err) {
    next(new Error(err.message));
  }
};
export default {
  registerUser,
  loginUser,
  generateQrFor2FA,
  verify2FAOnApp,
  verified2FAOnApp,
  send2FAOnEmail,
  verify2FAByEmail,
  homepage,
  privateList,
};
