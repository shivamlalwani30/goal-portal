const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const connectDB = require("./src/db/connectDB");

const User = require("./src/models/User");
const GoalCycle = require("./src/models/GoalCycle");
const GoalSheet = require("./src/models/GoalSheet");
const Goal = require("./src/models/Goal");
const Checkin = require("./src/models/Checkin");

const seedData = async () => {
    try {
        await connectDB();

        await User.deleteMany();
        await GoalCycle.deleteMany();
        await GoalSheet.deleteMany();
        await Goal.deleteMany();
        await Checkin.deleteMany();

        const hashedPassword = await bcrypt.hash("password123", 10);

        const admin = await User.create({
            name: "Arjun Singh",
            email: "admin@demo.com",
            password: hashedPassword,
            role: "admin",
            department: "HR",
        });

        const manager = await User.create({
            name: "Meera Patel",
            email: "manager@demo.com",
            password: hashedPassword,
            role: "manager",
            department: "Sales",
        });

        const employee = await User.create({
            name: "Rohit Kumar",
            email: "employee@demo.com",
            password: hashedPassword,
            role: "employee",
            department: "Sales",
        });

        const cycle = await GoalCycle.create({
            name: "FY 2025-26",
            startDate: "2025-05-01",
            endDate: "2026-04-30",
        });

        const sheet = await GoalSheet.create({
            user: employee._id,
            cycle: cycle._id,
            status: "approved",
        });

        const goal1 = await Goal.create({
            sheet: sheet._id,
            title: "Achieve quarterly sales target",
            description: "Achieve 5M sales target",
            targetValue: 5000000,
            weightage: 40,
            status: "on_track",
        });

        const goal2 = await Goal.create({
            sheet: sheet._id,
            title: "Maintain NPS score above 70",
            description: "Customer satisfaction goal",
            targetValue: 70,
            weightage: 30,
            status: "on_track",
        });

        await Checkin.create({
            goal: goal1._id,
            quarter: "Q1",
            progress: 64,
            employeeNote: "Pipeline looks strong for Q2",
            managerComment: "Good progress",
        });

        await Checkin.create({
            goal: goal2._id,
            quarter: "Q1",
            progress: 100,
            employeeNote: "Customers happy",
            managerComment: "Excellent",
        });

        console.log("Seed Data Inserted Successfully");

        process.exit();
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

seedData();