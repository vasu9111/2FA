import userMdl from "../model/user.js";

const findByEmail = async (email) => {
  const result = await userMdl.findOne({ email });
  return result;
};

const findByUserId = async (userId) => {
  const result = await userMdl.findById(userId);
  return result;
};

const updateUserById = async (userId, userData, email) => {
  const result = await userMdl.findByIdAndUpdate(userId, userData, email);
  return result;
};
export default {
  findByEmail,
  findByUserId,
  updateUserById,
};
