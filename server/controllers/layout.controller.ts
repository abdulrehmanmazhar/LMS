import { NextFunction, Response, Request } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncError";
import cloudinary from "cloudinary";
import LayoutModel from "../models/layout.model";

export const createLayout = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {type} = req.body;
        const isTypeExist = await LayoutModel.findOne({type})
        if(isTypeExist){
            return next( new ErrorHandler(`type ${type} already exists`, 400))
        }
        if(type === "Banner"){
            const {image, title, subTitle} = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image,{
                folder: "Layout"
            });
            
            const banner ={
                image:{
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subTitle,
            }
            await LayoutModel.create({type:"Banner",banner});
        }
        if(type === "FAQ"){
            const {faq} = req.body;
            const faqItems = await Promise.all(
                faq.map(async(item:any)=>{
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.create({type:'FAQ', faq: faqItems});

        }
        if(type === "Categories"){
            const {categories} = req.body;
            const categoryItems = await Promise.all(
                categories.map(async(item:any)=>{
                    return {
                        title: item.title,
                    }
                })
            )
            await LayoutModel.create({type:'Categories', categories: categoryItems});
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

// Edit layout 

export const editLayout = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const {type} = req.body;
        const isTypeExist = await LayoutModel.findOne({type})
        if(!isTypeExist){
            return next( new ErrorHandler(`Type not found`, 404))
        }
        if(type === "Banner"){
            const bannerData: any = await LayoutModel.findOne({type: 'Banner'})
            const {image, title, subTitle} = req.body;

            if(bannerData){
                await cloudinary.v2.uploader.destroy(bannerData.image.public_id)
            }
                const myCloud = await cloudinary.v2.uploader.upload(image,{
                    folder: "Layout"
                });
            
            const banner ={
                image:{
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url
                },
                title,
                subTitle,
            }
            await LayoutModel.findByIdAndUpdate(bannerData?._id,{banner})
        }
        if(type === "FAQ"){
            const {faq} = req.body;
            const faqItem = await LayoutModel.findOne({type: 'FAQ'});
            const faqItems = await Promise.all(
                faq.map(async(item:any)=>{
                    return {
                        question: item.question,
                        answer: item.answer
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(faqItem?._id,{type:'FAQ', faq: faqItems});

        }
        if(type === "Categories"){
            const {categories} = req.body;
            const categoryData = await LayoutModel.findOne({type: 'Categories'});

            const categoryItems = await Promise.all(
                categories.map(async(item:any)=>{
                    return {
                        title: item.title,
                    }
                })
            )
            await LayoutModel.findByIdAndUpdate(categoryData?._id,{type:'Categories', categories: categoryItems});
        }

        res.status(200).json({
            success: true,
            message: "Layout created successfully"
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
})

export const getLayoutByType = CatchAsyncError(async(req: Request, res: Response, next: NextFunction)=>{
    try {
        const layout = await LayoutModel.findOne({type: req.body.type});
        if(!layout) {
            return next( new ErrorHandler(`Type not found`, 404))
        }
        res.status(200).json({
            success: true,
            layout,
        })
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
        
    }
})