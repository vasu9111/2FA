import authService from "./auth.service.js";
import auth from "../../helper/auth.js";
const register = async (req, res, next) => {
  try {
    const register = await authService.register(req.body);
    res.status(200).json(register);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const login = await authService.login(req.body);

    login.IntermediateToken = await auth.intermediateToken(login.userData._id);
    res.status(200).json(login);
  } catch (error) {
    next(error);
  }
};

const get2FAQrData = async (req, res, next) => {
  try {
    const qrData = await authService.get2FAQrData(req.query.email);
    res.status(200).json(qrData);
  } catch (error) {
    next(error);
  }
};

const verified2FAOnApp = async (req, res, next) => {
  try {
    const Data = await authService.verified2FAOnApp(
      req.body.secret,
      req.body.code,
      req.user._id
    );
    res.status(200).json(Data);
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

export default {
  register,
  login,
  get2FAQrData,
  verified2FAOnApp,
  send2FAOnEmail,
  verify2FAByEmail,
  homepage,
};
