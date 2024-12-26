// controllers/teacherController.js
import teacherModel from '../models/teacherModel.js';
import classModel from "../models/classModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const loginTeacher = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Log the request
        console.log('Login attempt:', { email });

        const teacher = await teacherModel.findOne({ email });
        
        if (!teacher) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const isMatch = await bcrypt.compare(password, teacher.password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign(
            { id: teacher._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            token,
            teacher: {
                id: teacher._id,
                name: teacher.name,
                email: teacher.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

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

// Add completeClass controller
const completeClass = async (req, res) => {
    try {
        const { classId } = req.params;
        
        const updatedClass = await classModel.findByIdAndUpdate(
            classId,
            { isCompleted: true },
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
            message: "Class completed successfully", 
            class: updatedClass 
        });
    } catch (error) {
        console.error("Error in completing class:", error);
        res.status(500).json({ 
            success: false, 
            message: "Failed to complete class" 
        });
    }
};


// API to change doctor availablity for Admin and Doctor Panel
const changeAvailablity = async (req, res) => {
    try {

        const { teacherId } = req.body

        const teacherData = await teacherModel.findById(docId)
        await teacherModel.findByIdAndUpdate(teacherId, { available: !teacherData.available })
        res.json({ success: true, message: 'Availablity Changed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get teacher profile for  Teacher Panel
const teacherProfile = async (req, res) => {
    try {
        const teacherId = req.teacherId;
        console.log('Fetching teacher profile with ID:', teacherId);

        const profileData = await teacherModel.findById(teacherId)
            .select('-password')
            .lean();  // Convert to plain JavaScript object

        console.log('Found profile:', profileData);

        if (!profileData) {
            return res.status(404).json({
                success: false,
                message: "Teacher profile not found"
            });
        }

        res.json({ 
            success: true, 
            profileData 
        });

    } catch (error) {
        console.error('Profile fetch error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}

// API to update teacher profile data from  Teacher Panel
const updateTeacherProfile = async (req, res) => {
    try {
        const teacherId = req.teacherId;
        const { address, about, available } = req.body;
        
        const updatedTeacher = await teacherModel.findByIdAndUpdate(
            teacherId,
            {
                about,
                available,
                address: {
                    line1: address.line1,
                    line2: address.line2
                }
            },
            { new: true }
        ).select('-password');

        if (!updatedTeacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        res.json({ 
            success: true, 
            message: 'Profile Updated',
            profileData: updatedTeacher
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
}


export {
    changeAvailablity,
    getClasses,
    cancelClass,
    completeClass,
    teacherProfile,
    updateTeacherProfile
}