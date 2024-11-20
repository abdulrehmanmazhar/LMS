import express, { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import orderModel, {IOrder} from "../models/order.model";
import userModel, {User as IUser} from "../models/user.model";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";
import { getAllOrders, newOrder } from "../services/order.service";
import { redis } from "../utils/redis";
// create order 
export const createOrder = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {courseId, payment_info, } = req.body as IOrder;

        const user = await userModel.findById(req.user?._id) as IUser;
        const userId = req.user?._id;
        const courseExistInUser = user.courses.some((course:any)=> course._id.toString()=== courseId)

        if(courseExistInUser){
            return next(new ErrorHandler("Course already purchased", 400))
        }

        const course = await CourseModel.findById(courseId);

        if(!course){
            return next(new ErrorHandler("Cannot find course", 404))
        }

        const data: any = {
            courseId: course._id,
            userId: user?._id
        }


        const mailData = {
            order: {
                _id: courseId.slice(0,6),
                name: course.name,
                price: course.price,
                date: new Date().toLocaleDateString('en-US', {year: 'numeric', month: "long", day: "numeric"})
            }
        }

        const html = await ejs.renderFile(path.join(__dirname, "../mails/order-confirmation.ejs"),{order:mailData});

        try {
            if(user){
                await sendMail({
                    email: user.email,
                    subject: "Order Confirmation",
                    template: "order-confirmation.ejs",
                    data: mailData

                })
            }
        } catch (error) {
        return next(new ErrorHandler(error.message, 500));
            
        }
        user?.courses.push({_id:courseId});
        await user.save();
        await redis.set(userId, JSON.stringify(user));
        const notification = await notificationModel.create({
            user: user?._id,
            title: "New Order",
            message: `You have placed a new order of ${course?.name}` 
        })
        course.purchased+=1;
        await course.save()
        
        newOrder(data, res, next);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
        
    }
})

// get all users for admin

export const fetchAllOrders = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        getAllOrders(res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
        
    }
})