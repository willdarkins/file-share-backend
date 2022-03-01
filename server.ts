import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import router from './routes/index'
import { v2 as cloudinary } from 'cloudinary'

const app = express()
dotenv.config()

//configure api settings from cloudinary dependency
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_API_CLOUD,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//function call from db.ts to connect to database
connectDB();

//bodyParser middleware to convert JSON in post call
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

//cors middleware to communicate between front,back and db
app.use(cors());

//api import statement
app.use("/files", router);

//port variable
const port = process.env.PORT

//listen call to port
app.listen(port, () => {
    console.log(`🌎 Server is running on http://localhost:${port}`)
})