import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";

export const rootrouter = Router();

rootrouter.post("/signup", async(req, res) => {
    try{
        const {username,email,password} = await req.body;

        if(!username|| !email|| !password){

        }
    }catch(err){
        res.json({
            message:`Failed to signup ${err}`
        })
    }
});

rootrouter.post("/signin", (req, res) => {
  res.json({
    message: "signin route",
  });
});

rootrouter.get("/elements", (req, res) => {
  res.json({
    message: "elements route",
  });
});

rootrouter.get("/avatars", (req, res) => {
  res.json({
    message: " avatars route",
  });
});


rootrouter.use("/user",userRouter);
rootrouter.use("/admin",adminRouter);
rootrouter.use("/space",spaceRouter);
