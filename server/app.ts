require("dotenv").config();
import express, { Request, Response, NextFunction } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";


// body parser

app.use(express.json({limit: "50kb"}));

// cookie parser

app.use(cookieParser());

// cors

app.use(cors({
    origin: process.env.ORIGINS
}))

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