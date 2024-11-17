import express, { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { redis } from "../utils/redis";
import { User as IUser } from "../models/user.model";

export const isAuthenticated = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    const access_token = req.cookies.access_token;
    if (!access_token){
        return next(new ErrorHandler("User is not authenticated", 400));
    }
    const decoded = Jwt.verify(access_token, process.env.ACCESS_TOKEN as string) as JwtPayload
    if(!decoded){
        return next(new ErrorHandler("Access token is not valid", 400))
    }
    const user = (await redis.get(decoded.id)) as any ;
    
    if(!user){
        return next(new ErrorHandler("User not found",400))
    }
    // req.user = JSON.parse(user);
    req.user = user;
    
    next();
    console.log(user)
});

export const authorizeRoles = (...roles: string[])=>{
    return (req: Request, res: Response, next: NextFunction)=>{
        if(!roles.includes(req.user?.role)){
            return next(new ErrorHandler(`Role: ${req.user?.role} is not allowed to this resource`, 403))
        }
        next();
    }
}