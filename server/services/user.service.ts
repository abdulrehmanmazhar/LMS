import userModel from "../models/user.model"

export const getUserById = async(id: string, res:any)=>{
    const user = await userModel.findById(id);
    res.status(201).json({
        success: true,
        user
    })
} 