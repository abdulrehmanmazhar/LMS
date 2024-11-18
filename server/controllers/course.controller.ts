import express, { Request, Response, NextFunction, response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";


export const uploadCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const data = req.body
        const thumbnail = data.thumbnail

        if(thumbnail){
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                folder: "courses"
            })

            data.thumbnail = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        createCourse(data, res, next)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// edit course 

export const editCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const data = req.body
        const thumbnail = data.thumbnail

        if(thumbnail){
            if(thumbnail.public_id){
                await cloudinary.v2.uploader.destroy(thumbnail.public_id);
            }
            const myCloud = await cloudinary.v2.uploader.upload(thumbnail,{
                folder: "courses"
            })
            data.thumbnail = {
                public_id : myCloud.public_id,
                url: myCloud.secure_url
            }
        }
        const courseId = req.params.id;

        const course = await CourseModel.findByIdAndUpdate(courseId, {$set: data}, {new: true})

        res.status(201).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// get single course 

export const getSingleCourse = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const courseId = req.params.id

        const doesCacheExist = await redis.get(courseId);

        if(doesCacheExist){
            const course = doesCacheExist;
            return res.status(200).json({
                success: true,
                course
            })
        }
        const course = await CourseModel.findById(req.params.id).select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")
        res.status(200).json({
            success: true,
            course
        })
        redis.set(courseId,course)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// get all cousres without purchasing
export const getAllCourses = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")
        res.status(200).json({
            success: true,
            courses
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})