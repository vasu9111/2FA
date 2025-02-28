const errorCodes = {
  EMAIL_ALREADY_EXIST: {
    httpStatusCode: 401,
    body: {
      code: "email_already_exist",
      message: "email_already_exist",
    },
  },
  INVALID_PASSWORD: {
    httpStatusCode: 401,
    body: {
      code: "incalid_password",
      message: "INVALID_PASSWORD",
    },
  },
  USER_NOT_FOUND: {
    httpStatusCode: 404,
    body: {
      code: "user_not_found",
      message: "user not found",
    },
  },
};
export default errorCodes;
