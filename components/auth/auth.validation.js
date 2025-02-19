import Joi from "joi";
const registerUser = Joi.object({
  fname: Joi.string().min(2).max(15).required().messages({
    "string.empty": "Fname is not empty",
    "any.required": "Fname is required",
    "string.min": "Fname must be a 2 characters",
    "string.max": "Fname must be a 15 characters",
  }),
  lname: Joi.string().min(2).max(15).required().messages({
    "string.empty": "lname is not empty",
    "any.required": "lname is required",
    "string.min": "lname must be a 2 characters",
    "string.max": "lname must be a 15 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).max(10).required().messages({
    "string.empty": "Password can't be empty",
    "any.required": "Password is required",
    "string.min": "Password must be a 6 min characters",
    "string.max": "Password must be a max 10 characters",
  }),
});
const loginUser = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "invalid email format",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password can't be empty",
    "any.required": "Password is required",
  }),
});

export default {
  registerUser,
  loginUser,
};
