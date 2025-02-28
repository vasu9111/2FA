import dotenv from "dotenv-safe";
dotenv.config({
  path: "./.env",
  sample: "./.env.example",
  allowEmptyValues: true,
});

export default {
  port: process.env.PORT,
  dbUrl: process.env.MY_DB_URL,
  jwt: {
    accessTokenKey: process.env.ACCESS_TOKEN_KEY,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
  },
  sessionSecret: process.env.SESSION_KEY,
  intermediateTokenKey: process.env.INTERMEDIATE_TOKEN_KEY,
  intermediateTokenExpiry: process.env.INTERMEDIATE_TOKEN_EXPIRY,
};
