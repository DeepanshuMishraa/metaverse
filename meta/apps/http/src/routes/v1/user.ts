import { Router } from "express";


export const userRouter = Router();

userRouter.post("/metadata",(req,res)=>{
    res.json({
        message:'user metadata'
    })
})


userRouter.get("/metadata/bulk",(req,res)=>{
    res.json({});
})
