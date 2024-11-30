import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";


export const adminMiddleware = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if(!token){
        return res.status(403).json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET as string) as {role:string,userId:string};

        if(decoded.role !="Admin"){
            return res.status(403).json({
                message:"you are not given the admin role"
            })
        }

        req.userId = decoded.userId;
        next();

    }catch(err){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
}
