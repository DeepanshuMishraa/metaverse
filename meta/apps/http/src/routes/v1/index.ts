import { Router } from "express";
import { userRouter } from "./user";
import { adminRouter } from "./admin";
import { spaceRouter } from "./space";
import { signInSchema, signUpSchema } from "../../types";
const db = require("@repo/db/client");
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

export const rootrouter = Router();

rootrouter.post("/signup", async (req: any, res: any) => {
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
      message: "User already exists",
    });
  } catch (err) {
    res.json({
      message: `Failed to signup ${err}`,
    });
  }
});

rootrouter.post("/signin", async (req: any, res: any) => {
  const parsedData = signInSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Validation Error",
    });
    return;
  }

  try {
    //check if user exists

    const user = await db.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });
    if (!user) {
      res.json({
        message: "User doesnt exist please signup first",
      });
      return;
    }

    //check if correct password
    const comaprePass = await bcrypt.compare(
      parsedData.data.password,
      user.password
    );

    if (!comaprePass) {
      return res.json({
        message: "The Password you entered is wrong",
      });
    }

    // sign the jwt token
    const token = jwt.sign(
      { username: parsedData.data.username },
      JWT_SECRET as string,
      { expiresIn: "1h" }
    );
    return res.json({
      message: "Signin Succesfull",
      token: token,
    });
  } catch (err) {
    return res.json({
      message: `Error : ${err}`,
    });
  }
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
