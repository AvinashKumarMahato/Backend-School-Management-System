import jwt from "jsonwebtoken";
import classModel from "../models/classModel.js";
import teacherModel from "../models/teacherModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for adding Teacher
const addTeacher = async (req, res) => {
    try {
        const { name, email, password, expert, degree, experience, about, salary, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !expert || !degree || !experience || !about || !salary || !address) {
            return res.json({ success: false, message: "Missing Details" });
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const teacherData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            expert,
            degree,
            experience,
            about,
            salary,
            address: JSON.parse(address),
            date: Date.now(),
        };

        const newTeacher = new teacherModel(teacherData);
        await newTeacher.save();
        res.json({ success: true, message: "Teacher Added" });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all teachers list for admin panel
const allTeachers = async (req, res) => {
    try {
        const teachers = await teacherModel.find({}).select("-password");
        res.json({ success: true, teachers });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
const scheduleClass = async (req, res) => {
    try {
        console.log("Received request body:", req.body);
        
        const { teacherId, slotDate, slotTime, teacherData, selectedClass } = req.body;

        // Validate all required fields
        if (!teacherId || !slotDate || !slotTime || !teacherData || !selectedClass) {
            console.log("Missing fields validation failed:", {
                teacherId: !!teacherId,
                slotDate: !!slotDate,
                slotTime: !!slotTime,
                teacherData: !!teacherData,
                selectedClass: !!selectedClass
            });
            
            return res.status(400).json({ 
                message: "All fields are required!",
                receivedFields: {
                    teacherId,
                    slotDate,
                    slotTime,
                    teacherData: !!teacherData,
                    selectedClass
                }
            });
        }

        // Create the class document
        const classDoc = {
            teacherId,
            slotDate,
            slotTime,
            teacherData,
            selectedClass: selectedClass,
            date: Date.now(),
        };

        console.log("Attempting to create class with data:", classDoc);

        const newClass = new classModel(classDoc);
        console.log("Created new class instance:", newClass);

        const savedClass = await newClass.save();
        console.log("Saved class document:", savedClass);

        res.status(201).json({
            message: "Class scheduled successfully!",
            class: savedClass
        });
    } catch (error) {
        console.error("Error in scheduleClass:", error);
        res.status(500).json({
            message: "Failed to schedule class",
            error: error.toString(),
            stack: error.stack
        });
    }
};

// Add getClasses controller
const getClasses = async (req, res) => {
    try {
        const classes = await classModel.find().sort({ date: -1 });
        res.status(200).json({ 
            success: true, 
            classes 
        });
    } catch (error) {
        console.error("Error fetching classes:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch classes" 
        });
    }
};

// Controller to get the scheduled classes for admin
export const getScheduledClasses = async (req, res) => {
    try {
        const classes = await classModel.find().limit(10); // Fetch first 10 classes
        res.json({ classes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch scheduled classes' });
    }
};
// Add cancelClass controller
const cancelClass = async (req, res) => {
    try {
        const { classId } = req.params;
        
        const updatedClass = await classModel.findByIdAndUpdate(
            classId,
            { cancelled: true },
            { new: true }
        );

        if (!updatedClass) {
            return res.status(404).json({ 
                success: false, 
                message: "Class not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Class cancelled successfully", 
            class: updatedClass 
        });
    } catch (error) {
        console.error("Error cancelling class:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to cancel class" 
        });
    }
};

export {
    loginAdmin,
    addTeacher,
    allTeachers,
    scheduleClass,
    getClasses, cancelClass
};
