const express = require("express");
const Module = require("../models/Module");
const Quiz = require("../models/Quiz");
const Attempt = require("../models/Attempt");
const { protect, requireRole } = require("../middleware/authMiddleware");

const router = express.Router();

// All routes here are protected and for teachers only
router.use(protect, requireRole("teacher"));

// @route   POST /api/teacher/modules
// @desc    Create a learning module
// @access  Teacher
router.post("/modules", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const moduleDoc = await Module.create({
      title,
      description,
      createdBy: req.user._id
    });

    return res.status(201).json(moduleDoc);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/teacher/modules
// @desc    Get modules created by this teacher
// @access  Teacher
router.get("/modules", async (req, res) => {
  try {
    const modules = await Module.find({ createdBy: req.user._id }).sort({
      createdAt: -1
    });
    return res.json(modules);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/teacher/quizzes
// @desc    Create a quiz
// @access  Teacher
router.post("/quizzes", async (req, res) => {
  try {
    const { title, moduleId, questions } = req.body;

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res
        .status(400)
        .json({ message: "Title and at least one question are required" });
    }

    const quiz = await Quiz.create({
      title,
      module: moduleId || undefined,
      createdBy: req.user._id,
      questions
    });

    return res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/teacher/quizzes
// @desc    Get quizzes created by this teacher
// @access  Teacher
router.get("/quizzes", async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.user._id })
      .populate("module", "title")
      .sort({ createdAt: -1 });
    return res.json(quizzes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/teacher/quizzes/:quizId/attempts
// @desc    Get attempts for a given quiz
// @access  Teacher
router.get("/quizzes/:quizId/attempts", async (req, res) => {
  try {
    const { quizId } = req.params;

    const attempts = await Attempt.find({ quiz: quizId })
      .populate("student", "name email")
      .sort({ createdAt: -1 });

    return res.json(attempts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


