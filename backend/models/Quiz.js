const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true
    },
    options: [
      {
        type: String,
        required: true
      }
    ],
    correctOptionIndex: {
      type: Number,
      required: true
    },
    marks: {
      type: Number,
      default: 1
    }
  },
  { _id: false }
);

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    questions: [questionSchema]
  },
  {
    timestamps: true
  }
);

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;


