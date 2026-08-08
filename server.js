// ======================================
// server.js - Part 1A
// ======================================
const verifyAdmin = require("./middleware/auth");
const Admin = require("./models/Admin");
const Note = require("./models/Note");
const Course = require("./models/Course");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const User = require("./models/User");

const app = express();

// ========================
// Middleware
// ========================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// ========================
// Static Files
// ========================

app.use(express.static(path.join(__dirname, "public")));

// ========================
// MongoDB Connection
// ========================

mongoose.connect(process.env.MONGODB_URI)

.then(() => {

    console.log("✅ MongoDB Connected");

})

.catch((err) => {

    console.log("❌ MongoDB Connection Failed");

    console.log(err);

});

// ========================
// Home Route
// ========================

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );

});

// ========================
// Health Check
// ========================

app.get("/api/status", (req, res) => {

    res.json({

        success: true,

        message: "ECE Computer Center Server Running 🚀"

    });

});


// ======================================
// REGISTER API
// ======================================

app.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {

            return res.status(400).json({
                success: false,
                message: "Please fill all fields."
            });

        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "Email already registered."
            });

        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Account Created Successfully",
            name: user.name
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

});

// ======================================
// LOGIN API
// ======================================

app.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                success: false,
                message: "Email and Password are required."
            });

        }

        // Find User
        const user = await User.findOne({ email });

        if (!user) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            });

        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password."
            });

        }

        // Create JWT Token
        const token = jwt.sign(

            {
                id: user._id,
                email: user.email
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.json({

            success: true,

            message: "Login Successful",

            token: token,

            name: user.name,

            email: user.email

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

});

// ======================================
// SERVER START
// ======================================

const PORT = process.env.PORT || 3000;

// ======================================
// GET ALL STUDENTS
// ======================================

app.get("/students", verifyAdmin, async (req, res) => {

    try {

        const students = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(students);

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Unable to load students."

        });

    }

});

app.delete("/students/:id", verifyAdmin, async (req, res) => {

    try {

        await User.findByIdAndDelete(req.params.id);

        res.json({

            success: true,
            message: "Student Deleted Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Delete Failed"

        });

    }

});

// ======================================
// GET ALL NOTES
// ======================================

app.post("/notes", verifyAdmin, async (req, res) => {

    try {

        const { title, noteId, file } = req.body;

        const note = new Note({

            title,
            noteId,
            file

        });

        await note.save();

        res.json({

            success: true,
            message: "Note Added Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Unable to add note."

        });

    }

});

app.delete("/notes/:id", verifyAdmin, async (req, res) => {

    try {

        await Note.findByIdAndDelete(req.params.id);

        res.json({

            success: true,
            message: "Note Deleted Successfully"

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,
            message: "Delete Failed"

        });

    }

});

// ======================================
// GET COURSES
// ======================================

app.get("/courses", async (req, res) => {

    try {

        const courses = await Course.find()
            .sort({ createdAt: -1 });

        res.json(courses);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to load courses."

        });

    }

});



// ======================================
// ADD COURSE
// ======================================

app.post("/courses", verifyAdmin, async (req, res) => {

    try {

        const course = new Course(req.body);

        await course.save();

        res.json({

            success: true,

            message: "Course Added Successfully"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to add course."

        });

    }

});

// ======================================
// DELETE COURSE
// ======================================

app.delete("/courses/:id", verifyAdmin, async (req, res) => {

    try {

        await Course.findByIdAndDelete(req.params.id);

        res.json({

            success: true,

            message: "Course Deleted Successfully"

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Delete Failed"

        });

    }

});




// ======================================
// ADMIN LOGIN
// ======================================

app.post("/admin/login", async (req, res) => {

    try {

        const { username, password } = req.body;

        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and Password are required."
            });

        }

        const admin = await Admin.findOne({ username });

        if (!admin) {

            return res.status(401).json({
                success: false,
                message: "Invalid Username or Password"
            });

        }

        const match = await bcrypt.compare(password, admin.password);

        if (!match) {

            return res.status(401).json({
                success: false,
                message: "Invalid Username or Password"
            });

        }

        const token = jwt.sign(

            {
                id: admin._id
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.json({

            success: true,

            message: "Admin Login Successful",

            token

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Server Error"

        });

    }

});

// ======================================
// DASHBOARD STATS
// ======================================

app.get("/dashboard/stats", verifyAdmin, async (req, res) => {

    try {

        const totalStudents = await User.countDocuments();

        const totalNotes = await Note.countDocuments();

        res.json({

            success: true,

            totalStudents,

            totalNotes,

            totalCourses: 4

        });

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Unable to load dashboard."

        });

    }

});

app.get("/courses", async (req, res) => {

    try {

        const courses = await Course.find()
            .sort({ createdAt: -1 });

        res.json(courses);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Unable to load courses."
        });

    }

});

app.listen(PORT, () => {

    console.log(`🚀 Server running on port ${PORT}`);

});