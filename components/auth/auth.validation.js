import Joi from "joi";
const registerUser = Joi.object({
  fname: Joi.string().min(2).max(15).required(),
  lname: Joi.string().min(2).max(15).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(10).required(),
});
const loginUser = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const code = Joi.object({
  code: Joi.string().required(),
  secret: Joi.string().required(),
});
const otp = Joi.object({
  code: Joi.string().required(),
});
export default {
  registerUser,
  loginUser,
  code,
  otp,
};
