const express = require("express");
const Module = require("../models/Module");
const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, requireRole("student"));

router.get("/modules", async (req, res) => {
  try {
    const modules = await Module.find()
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    return res.json(modules);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate("module", "title")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/quizzes/:quizId/attempt", async (req, res) => {
  try {
    const { quizId } = req.params;
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    let score = 0;

    answers.forEach((ans) => {
      const q = quiz.questions[ans.questionIndex];
      if (q && q.correctOptionIndex === ans.selectedOptionIndex) {
        score += q.marks || 1;
      }
    });

    const attempt = await Attempt.create({
      student: req.user._id,
      quiz: quizId,
      answers,
      score
    });

    return res.status(201).json({ attemptId: attempt._id, score });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/attempts", async (req, res) => {
  try {
    const attempts = await Attempt.find({ student: req.user._id })
      .populate("quiz", "title")
      .sort({ createdAt: -1 });

    return res.json(attempts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


