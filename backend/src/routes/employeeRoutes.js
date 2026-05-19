const express = require("express");

const router = express.Router();

const Employee = require("../models/Employee");

// GET ALL EMPLOYEES
router.get("/", async (req, res) => {
  try {
    const employees =
      await Employee.find();

    res.json(employees);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// ADD EMPLOYEE
router.post("/", async (req, res) => {
  try {
    const employee =
      await Employee.create(
        req.body
      );

    res.status(201).json(
      employee
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE EMPLOYEE
router.delete(
  "/:id",
  async (req, res) => {
    try {
      await Employee.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message:
          "Employee deleted",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;