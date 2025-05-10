import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import auth from "../../helper/auth.js";
import userDb from "../../db/userDb.js";
import _ from "lodash";
import otpDb from "../../db/otpDb.js";

const emailExistingCheck = async (email) => {
  const countEmailExisting = await userDb.emailExistingCheck(email);

  if (countEmailExisting > 0) {
    return true;
  }
  return false;
};
const registerUser = async (reqBody) => {
  const { fname, lname, email, password } = reqBody;

  try {
    const emailCheck = await emailExistingCheck(email);
    if (emailCheck) {
      throw new Error("EMAIL_ALREADY_EXIST");
    }
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = await userDb.createUser({
      fname: fname.trim(),
      lname: lname.trim(),
      email,
      password: hashPassword,
      is2FAEnabled: true,
    });
    if (!newUser) {
      throw new Error("USER_NOT_FOUND");
    }

    const result = _.omit(newUser, ["password"]);
    return {
      message: "Registered successfully",
      userData: result,
    };
  } catch (err) {
    const error = new Error(err.message);
    throw error;
  }
};

///login user
const loginUser = async (reqBody) => {
  const { email, password } = reqBody;
  const findUser = await userDb.findUserByEmail(email);

  if (!findUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!bcrypt.compareSync(password, findUser.password)) {
    throw new Error("INVALID_PASSWORD");
  }
  const result = _.omit(findUser, ["password"]);
  return {
    userData: result,
  };
};

// QR send
const generateQrFor2FA = async (email) => {
  try {
    const findUser = await userDb.findUserByEmail(email);

    if (!findUser) {
      throw new Error("USER_NOT_FOUND");
    }
    const secret = speakeasy.generateSecret({
      name: `2FA : ${email}`,
    });
    const qr = await QRCode.toDataURL(secret.otpauth_url);

    return { qr, secret: secret.base32 };
  } catch (err) {
    throw new Error(err.message);
  }
};

// verify2FAOnApp
const verify2FAOnApp = async (secret, code, userId) => {
  try {
    let verified = speakeasy.totp.verify({
      secret: secret,
      encoding: "base32",
      token: code,
    });
    if (!verified) {
      return { isTwoFactorVerified: false };
    }
    await userDb.updateUserById(
      { _id: userId },
      {
        secret,
        twoFactorMode: "APP",
      }
    );
    const isTwoFactorVerified = true;
    const { accessToken, refreshToken } =
      await auth.generateAccessAndRefreshToken(userId, isTwoFactorVerified);
    const result = { accessToken, refreshToken, isTwoFactorVerified };
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

// app verified
const verified2FAOnApp = async (code, userId) => {
  try {
    const user = await userDb.findUserById(userId);
    let verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: code,
    });
    if (!verified) {
      return { isTwoFactorVerified: false };
    }
    const isTwoFactorVerified = true;
    const { accessToken, refreshToken } =
      await auth.generateAccessAndRefreshToken(userId, isTwoFactorVerified);
    const result = { accessToken, refreshToken, isTwoFactorVerified };
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};

// Email send
const send2FAOnEmail = async (email, userId) => {
  try {
    const user = await userDb.findUserById(userId);
    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }
    const currentTime = new Date();
    const otpExpiry = new Date(currentTime);
    const code = auth.generateOtp();
    console.log(code);

    const options = {
      otp: bcrypt.hashSync(code, bcrypt.genSaltSync(10)),
      createdAt: currentTime,
      otpExpiry: otpExpiry.setMinutes(otpExpiry.getMinutes() + 1),
      email,
    };
    await otpDb.addOtpToDb(options);

    await userDb.updateUserById({ _id: userId }, { twoFactorMode: "EMAIL" });
    return { status: true };
  } catch (err) {
    throw new Error(err.message);
  }
};

// verify Email

const verify2FAByEmail = async (email, code, userId) => {
  try {
    const findUser = await userDb.findUserByEmail(email);
    if (!findUser) {
      throw new Error("USER_NOT_FOUND");
    }
    const allotp = await otpDb.findAllOtpOfuserByEmail(email);

    let hasValidOTP = false;

    allotp.forEach(async (auth) => {
      const isMatch = bcrypt.compareSync(code, auth.otp);

      if (isMatch && new Date() < auth.otpExpiry) {
        hasValidOTP = true;
        await otpDb.deleteOtp({ email, otp: auth.otp });
        return false;
      }
      return true;
    });
    if (hasValidOTP) {
      let isTwoFactorVerified = true;
      const { accessToken, refreshToken } =
        await auth.generateAccessAndRefreshToken(userId, isTwoFactorVerified);
      return { accessToken, refreshToken, isTwoFactorVerified: true };
    }
    return { isTwoFactorVerified: false };
  } catch (error) {
    throw new Error(error.message);
  }
};
// home page
const homepage = () => {
  return { message: "This Is Homepage" };
};

const privateList = async () => {
  return {
    message: "islogin and is2FAVerified successfully",
  };
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
