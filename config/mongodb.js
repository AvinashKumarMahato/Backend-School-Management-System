import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // Listen for successful connection
    mongoose.connection.on("connected", () => console.log("Database Connected"));

    // Connect using the URI from the environment variable
    await mongoose.connect(process.env.MONGODB_URI);

  } catch (error) {
    console.error("Error connecting to database:", error.message);
    process.exit(1); // Exit the process with failure
  }
};

export default connectDB;
