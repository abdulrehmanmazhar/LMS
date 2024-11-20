import notificationModel from "../models/notification.model";
import express, { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cron from "node-cron";
// for admin 
export const getNotification = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const notifications = await notificationModel.find().sort({createdAt: -1})

        res.status(200).json({
            success: true,
            notifications
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
        
    }
})

// update notifications status
export const updateNotification = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const notification = await notificationModel.findById(req.params.id);

        if(!notification){
            return next(new ErrorHandler("No notification found",404))
        }else{
            notification.status? (notification.status = 'read'): notification.status;
        }
        await notification.save();
        const notifications = await notificationModel.find().sort({createdAt: -1})

        res.status(200).json({
            success: true,
            notifications
        })
        
    } catch (error) {
        
    }
})

// delete notifications admin 

cron.schedule("0 0 0 * * *", async function(){
    const thirtyDayAge = new Date(Date.now()-30*24*60*60*1000)
    await notificationModel.deleteMany({status: "read", createdAt: {$lt: thirtyDayAge} });
    console.log("deleted read notification");
})