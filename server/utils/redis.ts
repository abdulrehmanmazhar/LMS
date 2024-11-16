require("dotenv").config();
// import {Redis} from "ioredis";

// const redisClient = ()=>{
//     if(process.env.REDIS_URL){
//         console.log("redis connected")
//         return process.env.REDIS_URL
//     }
//     throw new Error("Redis connection failed")
// }

// export const redis = new Redis(redisClient());

import { Redis } from '@upstash/redis'

export const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN,
});