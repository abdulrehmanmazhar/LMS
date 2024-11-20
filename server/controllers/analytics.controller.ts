import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import { generateLast12MonthData } from "../utils/analyticsGenerator";
import userModel from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import CourseModel from "../models/course.model";
import orderModel from "../models/order.model";

export const getUserAnalytics = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const users = await generateLast12MonthData(userModel);
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const getCourseAnalytics = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const courses = await generateLast12MonthData(CourseModel);
        res.status(200).json({
            success: true,
            courses
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const getOrderAnalytics = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const orders = await generateLast12MonthData(orderModel);
        res.status(200).json({
            success: true,
            orders
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})