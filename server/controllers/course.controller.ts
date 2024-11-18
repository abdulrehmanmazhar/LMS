import express, { Request, Response, NextFunction, response } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse } from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";


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
        const allCourses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")
        await redis.set("allCourses", allCourses);

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
        await redis.set(courseId,course)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// get all cousres without purchasing
export const getAllCourses = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const doesCacheExist = await redis.get("allCourses");
        if(doesCacheExist){
            const courses = doesCacheExist;
            return res.status(200).json({
                success: true,
                courses
            })
        }
        const courses = await CourseModel.find().select("-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links")
        res.status(200).json({
            success: true,
            courses
        })
        await redis.set("allCourses", courses);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// get courses content --valid users 

export const getCourseByUser = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id;
        const courseExist = userCourseList?.find((course:any)=> course._id.toString()===courseId);

        if(!courseExist){
            return next(new ErrorHandler("You cannot access this course or buy it to access", 403))
        }

        const course = await CourseModel.findById(courseId);
        const content = course?.courseData;

        res.status(200).json({
            success: true,
            content
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// add questions in course 
interface IAddQuestionData{
    question: string;
    courseId: string;
    contentId: string;
}

export const addQuestion = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {question, courseId, contentId} : IAddQuestionData = req.body;
        const course = await CourseModel.findById(courseId)

        if(!mongoose.Types.ObjectId.isValid(contentId)){
            return next(new ErrorHandler("Invalid content Id",400))
        }

        const courseContent = course?.courseData?.find((item: any)=>{
            return item._id.equals(contentId)
        })

        if(!courseContent){
            return next(new ErrorHandler("Invalid content Id",400))

        }

        const newQuestion:any ={
            user: req.user,
            question,
            questionReplies:[],
        }
        courseContent.question.push(newQuestion);
        await course?.save();
        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})