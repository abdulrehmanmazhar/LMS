require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
// body parser

app.use(express.json({limit: "50kb"}));

// cookie parser

app.use(cookieParser());

// cors

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.ORIGINS : '*',
    credentials: true
}))

// routes

app.use("/api/v1",userRouter);
app.use("/api/v1",courseRouter);


// testing API 

app.get("/test", (req : Request, res : Response, next : NextFunction)=>{
    res.status(200).json({
        success: true,
        message: "API is working"
    })
})

// unknown route 

app.all("*", (req : Request, res : Response, next : NextFunction)=>{
    const err = new Error(`Can't find ${req.originalUrl} on this server`) as any;
    err.statusCode = 404;
    next(err);
})

app.use(errorMiddleware);