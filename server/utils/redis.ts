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
  url: 'https://firm-jaybird-27481.upstash.io',
  token: 'AWtZAAIjcDE1ZTJlNzBjOTJjMTA0NjFmYjhkZTVhZmY4Y2VjNzg5ZHAxMA',
});