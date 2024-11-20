import express, { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import ErrorHandler from "../utils/ErrorHandler";
import cloudinary from "cloudinary";
import { createCourse, allCoursesInDB} from "../services/course.service";
import CourseModel from "../models/course.model";
import { redis } from "../utils/redis";
import mongoose from "mongoose";
import ejs from "ejs"
import path from "path";
import sendMail from "../utils/sendMail";
import notificationModel from "../models/notification.model";
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

// add answers to questions 

interface IAnswerData{
    answer : string;
    courseId : string;
    contentId: string;
    questionId : string;

}

export const addAnswer = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {answer, courseId, contentId, questionId} : IAnswerData = req.body
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

        const question = courseContent?.question?.find((item:any)=>
            item._id.equals(questionId)
        )
        if(!question){
            return next(new ErrorHandler("Invalid question Id",400))
        }
        const newAnswer : any = {
            user: req.user,
            answer
        }
        question.questionReplies.push(newAnswer);
        await course?.save();

        if(req.user?._id === question.user._id){
            // create a notification
            await notificationModel.create({
                user: req.user?._id,
                title: "New Question",
                message: `You have new question in ${courseContent?.title}` 
            })
        }else{
            const data = {
                name: question.user.name,
                title: courseContent.title,
            }
            const html = await ejs.renderFile(path.join(__dirname, "../mails/question-reply.ejs"), data)

            try {
                await sendMail({
                    email: question.user.email,
                    subject: "Question Reply",
                    template: "question-reply.ejs",
                    data
                })
            } catch (error) {
                return next(new ErrorHandler(error.message, 500))
            }
        }
        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// add review in course 

interface IReviewData {
    review: string;
    courseId: string;
    rating: number;
    userId: string;
}
export const addReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const userCourseList = req.user?.courses;
        const courseId = req.params.id
        const courseExist = userCourseList?.some((course: any)=> course._id.toString()=== courseId.toString())
        if(!courseExist){
            return next(new ErrorHandler("You are not eligible to access this course", 403))
        }
        const course = await CourseModel.findById(courseId);

        const {review, rating} = req.body as IReviewData;
        const reviewData:any = {
            user: req.user,
            rating,
            comment: review,
        }
        course?.reviews.push(reviewData);

        let avg = 0;

        course?.reviews.forEach((rev: any)=>{
            avg += rev.rating;
        })
        if(course){
            course.rating = avg/course.reviews.length;
        }
        await course?.save();

        const notification = {
            title: 'New Review Receiced',
            message: `${req.user?.name} has given a review in ${course?.name}`
        }

        // create notification 
        await notificationModel.create({
            user: req.user?._id,
            title: "New Review",
            message: `You have new question in ${course?.name}` 
        })

        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})

// add reply in review 

interface IAddReviewData{
    comment: string;
    courseId: string;
    reviewId: string;
}

export const addReplyToReview = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {comment, courseId, reviewId} = req.body as IAddReviewData;
        const course = await CourseModel.findById(courseId);

        if(!course){
            return next(new ErrorHandler("Course not found", 404));
        }
        const review = course?.reviews?.find((rev:any)=>rev._id.toString()=== reviewId);
        if(!review){
            return next(new ErrorHandler("Review not found", 404));

        }

        const replyData : any = {
            user: req.user,
            comment,
        }
        if(!review.commentReplies){
            review.commentReplies  = [];
        }
        
        review.commentReplies.push(replyData);
        await course.save();
        res.status(200).json({
            success: true,
            course
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})
// get all users for admin

export const fetchAllCourses = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        allCoursesInDB(res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
        
    }
})