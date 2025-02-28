import userMdl from "../model/user.js";

const createUser = async (userData) => {
  const result = await userMdl.create(userData);
  return result.toJSON();
};

const findUserByEmail = async (email) => {
  const result = await userMdl.findOne({ email }).lean();
  return result;
};

const findUserById = async (userId) => {
  const result = await userMdl.findById(userId).lean();
  return result;
};

const updateUserById = async (userId, userData) => {
  const result = await userMdl.findByIdAndUpdate(userId, userData);
  return result;
};
const emailExistingCheck = async (email) => {
  const result = await userMdl.countDocuments({ email });
  return result;
};

export default {
  createUser,
  findUserByEmail,
  findUserById,
  updateUserById,
  emailExistingCheck,
};
