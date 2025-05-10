import OtpMdl from "../model/otp.js";

const findAllOtpOfuserByEmail = async (email) => {
  const result = await OtpMdl.find({ email }).lean();
  return result;
};
const addOtpToDb = async (userData) => {
  const result = await OtpMdl.create(userData);
  return result.toJSON();
};
const deleteOtp = async (userData) => {
  const result = await OtpMdl.deleteOne(userData);
  return result;
};
export default {
  findAllOtpOfuserByEmail,
  addOtpToDb,
  deleteOtp,
};
