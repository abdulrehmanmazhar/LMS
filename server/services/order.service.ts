import express, { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import orderModel from "../models/order.model";

export const newOrder = CatchAsyncError(async(data: any,res: Response ,next: NextFunction)=>{
    const order = await orderModel.create(data);
    // next(order)
    res.status(200).json({
        success: true,
        order
    })
})

export const getAllOrders = async(res: Response)=>{
    const orders = await orderModel.find().sort({createdAt: -1})
    res.status(200).json({
        success: true,
        orders,
    })

}