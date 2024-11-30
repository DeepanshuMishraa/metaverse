import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";


export const userMiddleWare = (req:Request,res:Response,next:NextFunction)=>{
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1];

    if(!token){
        return res.json({
            message:"Unauthorized"
        })
    }

    try{
        const decoded = jwt.verify(token,JWT_SECRET as string) as {role:string,userId:string};
        req.userId = decoded.userId;
        next();
    }catch(err){
        return res.json({
            message:"Unauthorized"
        })
    }
}
