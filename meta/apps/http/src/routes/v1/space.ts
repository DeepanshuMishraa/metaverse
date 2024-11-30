import { Router } from "express";

export const spaceRouter = Router();

spaceRouter.get("/:spaceId", (req, res) => {});

spaceRouter.post("/element", (req, res) => {});

spaceRouter.delete("/element", (req, res) => {});

spaceRouter.get("/:spaceId", (req, res) => {});

spaceRouter.post("/",(req,res)=>{
    //create a space
})


spaceRouter.delete("/:spaceId",(req,res)=>{
    // delete a space
})


spaceRouter.get("/all",(req,res)=>{
    // get all the spaces
})
