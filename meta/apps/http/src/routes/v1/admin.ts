import { Router } from "express";
import db from "@repo/db/db"


export const adminRouter = Router();


adminRouter.post("/element",async(req,res)=>{
    //create an element
    
})

adminRouter.put("/element/:elementId",(req,res)=>{
    // update an element

})

adminRouter.post("/avatar",(req,res)=>{
    //create an avatar
})

adminRouter.post("/map",(req,res)=>{
    //create a map
})
