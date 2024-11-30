import { Router } from "express";
import { updateMetadataSchema } from "../../types";
const db = require("@repo/db/client");


export const userRouter = Router();

userRouter.post("/metadata",async(req:any,res:any)=>{
    const parsedData = updateMetadataSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.status(400).json({
            message:"Invalid data validation failed"
        })
    }

    try{
        const updatedMetadata = await db.user.update({
            where:{
                
            }
        })
    }
})


userRouter.get("/metadata/bulk",(req,res)=>{
    res.json({});
})
