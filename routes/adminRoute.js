import express from 'express';
import {getClasses, cancelClass, loginAdmin, addTeacher, allTeachers,scheduleClass} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/teacherController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin)
adminRouter.post("/add-teacher", authAdmin, upload.single('image'), addTeacher)
adminRouter.post("/schedule-class", authAdmin, scheduleClass)
adminRouter.get("/all-teachers", authAdmin, allTeachers)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get('/get-classes', authAdmin, getClasses);
adminRouter.put('/cancel-class/:classId', authAdmin, cancelClass);

export default adminRouter;