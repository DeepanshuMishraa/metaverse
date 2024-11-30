import { NextFunction, Request, Response } from "express";
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";

export const userMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      role: string;
      userId: string;
    };
    req.userId = decoded.userId;
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};
