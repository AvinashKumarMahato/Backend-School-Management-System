import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import classModel from '../models/classModel.js'

// API to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password, class: userClass } = req.body; // Added 'class' field

        // Checking for all data to register the user
        if (!name || !email || !password || !userClass) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Validating class selection
        const validClasses = ['class1', 'class2']; // Define valid classes
        if (!validClasses.includes(userClass)) {
            return res.json({ success: false, message: "Invalid class selected" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10); // The more rounds, the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt);

        // Preparing user data
        const userData = {
            name,
            email,
            password: hashedPassword,
            class: userClass, // Add the selected class to user data
        };

        // Creating and saving the user
        const newUser = new userModel(userData);
        const user = await newUser.save();

        // Generating a token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.json({ success: true, token });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}


// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender, class: userClass } = req.body;
        const imageFile = req.file;

        // Validate required fields
        if (!userId || !name || !phone || !dob || !gender || !userClass || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Update user data
        const updateData = {
            name,
            phone,
            class: userClass,
            address: JSON.parse(address),
            dob,
            gender,
        };

        // If there's an image file, upload to Cloudinary
        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
            updateData.image = imageUpload.secure_url;
        }

        // Perform update in database
        await userModel.findByIdAndUpdate(userId, updateData);

        res.status(200).json({ success: true, message: "Profile Updated Successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Server Error: " + error.message });
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
  
  


export {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    getClasses
}