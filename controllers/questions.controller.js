const axios = require("axios");
const Question = require("../models/questions.mongo");

async function getQuestions(req, res) {
  try {
    const question = await Question.find();
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function createQuestion(req, res) {
  const { title, description } = req.body;

  try {
    const question = new Question({ title, description });
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function updateQuestion(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const question = await Question.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function deleteQuestion(req, res) {
  const { id } = req.params;

  try {
    await Question.findByIdAndDelete(id);
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

async function checkSolution(req, res) {
  const { questionId } = req.params;
  const { solution } = req.body;

  try {
    // Call Sphere Engine API to check the solution
    const response = await axios.post(
      "https://api.sphere-engine.com/api/v4/endpoint",
      {
        access_token: process.env.ACCESS_TOKEN,
        action: "run",
        sourceCode: solution,
        language: "10",
        input: await Question.findByIdAndDelete(questionId),
      }
    );

    // Extract the response from the API
    const { response: engineResponse, error } = response.data;

    // Process the response
    if (error) {
      // If there's an error from the Sphere Engine API
      res.status(500).json({ error });
    } else {
      // If the solution is correct
      if (engineResponse === "success") {
        res.json({ message: "Solution is correct" });
      } else {
        // If the solution is incorrect
        const { description, compilation, tests } = engineResponse;
        res.json({ description, compilation, tests });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  getQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
};
