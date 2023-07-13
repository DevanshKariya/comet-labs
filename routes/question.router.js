const express = require("express");
const {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
} = require("../controllers/questions.controller");
const {
  authenticateUser,
  authorizeAdmin,
} = require("../middleware/authMiddleware.js");

const questionRouter = express.Router();

questionRouter.get("/", getQuestions);
questionRouter.post("/", authenticateUser, authorizeAdmin, createQuestion);
questionRouter.put("/:id", authenticateUser, authorizeAdmin, updateQuestion);
questionRouter.delete("/:id", authenticateUser, authorizeAdmin, deleteQuestion);

module.exports = questionRouter