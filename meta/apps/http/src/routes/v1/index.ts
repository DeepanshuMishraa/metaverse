import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { signUpSchema } from "../../types";
import db from "@repo/db/client";
import bcrypt from "bcryptjs";

export const rootrouter = Router();

rootrouter.post("/signup", async (req:any, res:any) => {
  try {
    const parsedData = signUpSchema.safeParse(req.body);
    if (!parsedData.success) {
       res.status(400).json({
        message: "Invalid data",
      });
      return;
    }

    //check if user exisits

    const user = await db.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });

    if (!user) {
      const hashedPassword = await bcrypt.hashSync(
        parsedData.data.password,
        10
      );

      const newUser = await db.user.create({
        data: {
          email: parsedData.data.email,
          username: parsedData.data.username,
          password: hashedPassword,
          name: parsedData.data.name,
          role: parsedData.data.type === "admin" ? "Admin" : "User",
        },
      });

      return res.status(200).json({
        message: "signup Successfull",
        data: newUser,
      });
    }

    return res.status(400).json({
        message: "User already exists"
    })
  } catch (err) {
    res.json({
      message: `Failed to signup ${err}`,
    });
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

rootrouter.use("/user", userRouter);
rootrouter.use("/admin", adminRouter);
rootrouter.use("/space", spaceRouter);
