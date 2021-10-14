const express = require("express");
const mongoose = require("mongoose");
const Quiz = require("../models/quiz");

const createQuiz = async (req, res) => {
  const {
    name,
    description,
    creatorId,
    pointType,
    pointsPerQuestion,
    answerTime,
  } = req.body;
  const quiz = new Quiz({
    name,
    description,
    creatorId,
    pointType,
    pointsPerQuestion,
    answerTime,
  });

  try {
    const newQuiz = await quiz.save();
    res.status(201).json(newQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuizes = async (req, res) => {
  try {
    const quizes = await Quiz.find();
    res.status(200).send(quizes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuiz = async (req, res) => {
  let quiz;
  try {
    quiz = await Quiz.findById(req.params.id);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No quiz with id: ${id}`);
  }

  try {
    await Quiz.findByIdAndRemove(id);
    res.json({ message: "Quiz deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuiz = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send(`No quiz with id: ${id}`);
  }

  const {
    name,
    description,
    creatorId,
    pointType,
    pointsPerQuestion,
    answerTime,
  } = req.body;
  const quiz = new Quiz({
    _id: id,
    name,
    description,
    creatorId,
    pointType,
    pointsPerQuestion,
    answerTime,
  });

  try {
    const updatedQuiz = await Quiz.findByIdAndUpdate(id, quiz, { new: true });
    res.json(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const addQuestion = async (req, res) => {
  const { quizId } = req.params;
  const { questionType, question, answerList, correctAnswer } = req.body;
  let quiz;
  try {
    quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    quiz.questionList.push({
      questionType,
      question,
      answerList,
      correctAnswer,
    });
    quiz.numberOfQuestions += 1;
    const updatedQuiz = await quiz.save();
    res.send(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getQuestions = async (req, res) => {
  const { quizId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.status(200).send(quiz.questionList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  try {
    const quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    const question = quiz.questionList.id(questionId);
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(404).send(`No quiz with id: ${quizId}`);
  }
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send(`No question with id: ${questionId}`);
  }
  const quiz = await Quiz.findById(quizId);

  try {
    let questionIndex = quiz.questionList.findIndex(
      (obj) => obj._id == questionId
    );
    quiz.questionList.splice(questionIndex, 1);
    quiz.numberOfQuestions -= 1;
    await Quiz.findByIdAndUpdate(quizId, quiz, {
      new: true,
    });
    res.json({ message: "Question deleted succesfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateQuestion = async (req, res) => {
  const { quizId, questionId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(quizId)) {
    return res.status(404).send(`No quiz with id: ${quizId}`);
  }
  if (!mongoose.Types.ObjectId.isValid(questionId)) {
    return res.status(404).send(`No question with id: ${questionId}`);
  }

  const { questionType, question, answerList, correctAnswer } = req.body;
  let quiz;

  try {
    quiz = await Quiz.findById(quizId);
    if (quiz == null) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    let questionIndex = quiz.questionList.findIndex(
      (obj) => obj._id == questionId
    );
    quiz.questionList[questionIndex] = {
      _id: questionId,
      questionType,
      question,
      answerList,
      correctAnswer,
    };
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, quiz, {
      new: true,
    });
    res.send(updatedQuiz);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createQuiz,
  getQuizes,
  getQuiz,
  deleteQuiz,
  updateQuiz,
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
};