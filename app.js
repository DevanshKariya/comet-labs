const express = require("express");
const morgan = require("morgan");
const userRouter = require("./routes/user.router");
const questionRouter = require("./routes/question.router");

const app = express();

app.use(morgan("combined"));

app.use(express.json());

app.get("/home", (req, res) => {
  res.status(200).json("hi");
});
app.use("/auth", userRouter);
app.use("/questions", questionRouter);

module.exports = app;
