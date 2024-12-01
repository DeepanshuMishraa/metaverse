import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

export const adminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1];

  if (!token) {
    res.status(403).json({
      message: "Unauthorized",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET as string) as {
      role: string;
      userId: string;
    };

    if (decoded.role != "Admin") {
      res.status(403).json({
        message: "you are not given the admin role",
      });
      return;
    }

    req.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};
