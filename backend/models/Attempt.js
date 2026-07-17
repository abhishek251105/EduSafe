const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionIndex: {
      type: Number,
      required: true
    },
    selectedOptionIndex: {
      type: Number,
      required: true
    }
  },
  { _id: false }
);

const attemptSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true
    },
    answers: [answerSchema],
    score: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Attempt = mongoose.model("Attempt", attemptSchema);

module.exports = Attempt;


