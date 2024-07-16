const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoute = require("./routes/user");
const cors = require("cors");
mongoose
  .connect("mongodb://localhost:27017/Login", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4,
  })
  .then(() => console.log("Db connection sucessfull"))
  .catch((err) => {
    console.log(err);
  });
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoute);

app.listen(5000, () => {
  console.log("Backend server is running");
});
