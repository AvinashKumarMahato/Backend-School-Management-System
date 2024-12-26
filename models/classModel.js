// classModel.js
import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    teacherId: {
        type: String,
        required: [true, 'Teacher ID is required']
    },
    slotDate: {
        type: String,
        required: [true, 'Slot date is required']
    },
    slotTime: {
        type: String,
        required: [true, 'Slot time is required']
    },
    teacherData: {
        type: Object,
        required: [true, 'Teacher data is required']
    },
    selectedClass: {
        type: String,
        required: [true, 'Selected class is required'],
        enum: ['CLASS 1', 'CLASS 2', 'CLASS 3', 'CLASS 4', 'CLASS 5', 
               'CLASS 6', 'CLASS 7', 'CLASS 8', 'CLASS 9', 'CLASS 10']
    },
    date: {
        type: Number,
        required: [true, 'Date is required']
    },
    cancelled: {
        type: Boolean,
        default: false
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add middleware to log document before saving
classSchema.pre('save', function(next) {
    console.log('About to save class document:', this.toObject());
    next();
});

const classModel = mongoose.models.classes || mongoose.model("classes", classSchema);
export default classModel;