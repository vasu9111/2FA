import express from "express";
import mongoose from "mongoose";
import router from "./components/index.js";
import envData from "./config/config.js";

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
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(err.status || 500).json({
      error_code: err.code || "server_error",
      message: err.message || "internal server error",
    });
  }
});
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
