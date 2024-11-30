import { Router } from "express";

const db = require("@repo/db/client");


export const adminRouter = Router();


adminRouter.post("/element",(req,res)=>{
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
