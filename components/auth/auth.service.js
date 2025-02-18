import bcrypt from "bcrypt";
import userMdl from "../../model/user.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import auth from "../../helper/auth.js";
import otp from "../../model/otp.js";

const register = async (reqBody) => {
  const { fname, lname, email, password } = reqBody;

  try {
    const hashPassword = bcrypt.hashSync(password, 10);
    const newUser = await userMdl({
      fname,
      lname,
      email,
      password: hashPassword,
      is2FAEnabled: true,
    });
    await newUser.save();
    if (!newUser) {
      throw new Error("Error during register");
    }
    const userData = {
      _id: newUser._id,
      fname: newUser.fname,
      lname: newUser.lname,
      email: newUser.email,
      is2FAEnabled: newUser.is2FAEnabled,
      secret: newUser.secret,
      twoFactorMode: newUser.twoFactorMode,
    };
    return {
      message: "Registered successfully",
      userData: userData,
    };
  } catch (err) {
    throw new Error(message);
  }
};

///login user
const login = async (reqBody) => {
  const { email, password } = reqBody;
  const findUser = await userMdl.findOne({ email });

  if (!findUser) {
    throw new Error("USER_NOT_FOUND");
  }

  if (!bcrypt.compareSync(password, findUser.password)) {
    throw new Error("Invalid password");
  }
  const userData = {
    _id: findUser._id,
    fname: findUser.fname,
    lname: findUser.lname,
    email: findUser.email,
    is2FAEnabled: findUser.is2FAEnabled,
    twoFactorMode: findUser.twoFactorMode,
  };
  return {
    userData,
  };
};

// QR send
const get2FAQrData = async (email) => {
  try {
    const userFound = await userMdl.findOne({ email });

    if (!userFound) {
      throw new Error(`User not found`);
    }

    if (!userFound.is2FAEnabled) {
      throw new Error(`2FA not enabled`);
    }

    const secret = speakeasy.generateSecret({
      name: `2FA : ${email}`,
    });
    const qr = await QRCode.toDataURL(secret.otpauth_url);
    await userMdl.findByIdAndUpdate(userFound._id, { secret: secret.base32 });

    return { qr, secret: secret.base32 };
  } catch (err) {
    throw new Error(err.message);
  }
};

//
const send2FAOnApp = async (secret, code, userId) => {
  try {
    const user = await userMdl.findById(userId);
    let verified = speakeasy.totp.verify({
      secret: user.secret,
      encoding: "base32",
      token: code,
    });
    if (!verified) {
      return { isTwoFactorVerified: false };
    }
    await userMdl.findByIdAndUpdate(
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
    const user = await userMdl.findById(userId);
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
    const user = await userMdl.findById(userId);
    if (!user) {
      throw new Error("User not found");
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
    await otp.create(options);

    await userMdl.findByIdAndUpdate(
      { _id: userId },
      { twoFactorMode: "EMAIl" }
    );
    return { status: true };
  } catch (err) {
    throw new Error(err.message);
  }
};

// verify Email

const verify2FAByEmail = async (email, code, userId) => {
  try {
    const userFound = await userMdl.findOne({ email });
    if (!userFound) {
      throw new Error("User not found");
    }
    const allotp = await otp.find({ email });
    let hasValidOTP = false;

    allotp.forEach(async (auth) => {
      const isMatch = bcrypt.compareSync(code, auth.otp);

      if (isMatch && new Date() < auth.otpExpiry) {
        hasValidOTP = true;
        await otp.deleteOne({ email, otp: auth.otp });
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

export default {
  register,
  login,
  get2FAQrData,
  send2FAOnApp,
  verified2FAOnApp,
  send2FAOnEmail,
  verify2FAByEmail,
  homepage,
};
