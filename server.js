import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"
import userRouter from "./routes/userRoute.js"
import teacherRouter from "./routes/teacherRoute.js"
import adminRouter from "./routes/adminRoute.js"

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// Test route to verify server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// api endpoints
app.use("/api/user", userRouter)
app.use("/api/admin", adminRouter)
app.use('/api/teacher', teacherRouter);

app.get("/", (req, res) => {
  res.send("API Working")
});

app.listen(port, () => console.log(`Server started on PORT:${port}`))