import express from 'express';
import { loginTeacher, getClasses, cancelClass, completeClass, teacherProfile, updateTeacherProfile } from '../controllers/teacherController.js';
import authTeacher from '../middleware/authTeacher.js';

const router = express.Router();

// Add debugging middleware
router.use((req, res, next) => {
    console.log('Teacher Route hit:', req.method, req.path);
    console.log('Headers:', req.headers);
    next();
});

// Routes
router.post("/login", loginTeacher);
router.get("/profile", authTeacher, teacherProfile);  // This should match your frontend call
router.post("/update-profile", authTeacher, updateTeacherProfile);
router.get("/classes", authTeacher, getClasses);
router.put('/cancel-class/:classId', authTeacher, cancelClass);
router.put('/complete-class/:classId', authTeacher, completeClass);

export default router;