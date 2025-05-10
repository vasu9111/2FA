import express from "express";
import mongoose from "mongoose";
import router from "./indexRoutes.js";
import envData from "./config/config.js";
import errorCodes from "./errorcode.js";

const PORT = envData.port;
console.log("envData.port", envData.port);
const MY_DB_URL = envData.dbUrl;
const app = express();
app.use(express.json());

mongoose
  .connect(MY_DB_URL)
  .then(() => {
    console.log(`Database Connected`);
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use("/api", router);
app.use((err, req, res, next) => {
  console.log("error", { err });

  const errorCode = errorCodes[err.message];
  if (errorCode) {
    return res.status(errorCode.httpStatusCode).json(errorCode.body);
  }
  res.status(500).json({
    code: err.code || "server_crashed",
    message: err.message || "Server crashed",
  });
});
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
