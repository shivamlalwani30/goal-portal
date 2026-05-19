const express = require("express");

const router = express.Router();

const Goal = require("../models/Goal");


// =======================
// GET ALL GOALS
// =======================
router.get("/", async (req, res) => {
    try {
        const goals = await Goal.find();

        res.json(goals);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
});


// =======================
// ADD GOAL
// =======================
router.post("/", async (req, res) => {
    try {
        const {
            title,
            weightage,
            status,
            assignedTo,
            assignedBy,
            priority,
            deadline,
        } = req.body;

        const newGoal = await Goal.create({
            title,
            weightage,
            status,
            progress: 0,
            assignedTo,
            assignedBy,
            priority,
            deadline,
        });

        res.status(201).json(newGoal);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
});


// =======================
// UPDATE PROGRESS
// =======================
router.put("/:id", async (req, res) => {
    try {
        const updatedGoal =
            await Goal.findByIdAndUpdate(
                req.params.id,
                {
                    progress: req.body.progress,
                },
                {
                    new: true,
                }
            );

        res.json(updatedGoal);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
});


// =======================
// DELETE GOAL
// =======================
router.delete("/:id", async (req, res) => {
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
});

module.exports = router;