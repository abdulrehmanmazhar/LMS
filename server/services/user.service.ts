import userModel from "../models/user.model"
import { redis } from "../utils/redis";

export const getUserById = async(id: string, res:any)=>{
    const user = await redis.get(id);
    if(user){

        res.status(201).json({
            success: true,
            user
        })
    }
} 