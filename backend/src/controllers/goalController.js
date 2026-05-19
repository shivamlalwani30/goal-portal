const Goal = require("../models/Goal");

// GET ALL GOALS
const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find();

    res.json(goals);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE GOAL
const createGoal = async (req, res) => {
  try {
    const { title, weightage, status, progress } =
      req.body;

    const newGoal = await Goal.create({
      title,
      weightage,
      status,
      progress,
    });

    res.status(201).json(newGoal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE GOAL
const deleteGoal = async (req, res) => {
  try {
    await Goal.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Goal Deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE GOAL
const updateGoal = async (req, res) => {
  try {
    const updatedGoal =
      await Goal.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedGoal);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getGoals,
  createGoal,
  deleteGoal,
  updateGoal,
};