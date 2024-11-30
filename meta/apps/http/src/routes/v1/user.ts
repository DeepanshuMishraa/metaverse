import { Request, Response, Router } from "express";
import { updateMetadataSchema } from "../../types";
import { userMiddleWare } from "../../middleware/user";
const db = require("@repo/db/client");

export const userRouter = Router();

userRouter.post("/metadata", userMiddleWare, async (req: any, res: any) => {
  const parsedData = updateMetadataSchema.safeParse(req.body);
  if (!parsedData.success) {
    return res.status(400).json({
      message: "Invalid data validation failed",
    });
  }

  try {
    const avatarExists = await db.avatar.findUnique({
      where: {
        id: parsedData.data.avatarId,
      },
    });

    if (!avatarExists) {
      return res.status(400).json({
        message: "Avatar does not exists",
      });
    }

    const updatedMetadata = await db.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });

    res.json({
      message: "Metadata updated successfully",
      data: updatedMetadata,
    });
  } catch (err) {
    res.json({
      message: `Failed to update metadata ${err}`,
    });
  }
});

userRouter.get("/metadata/bulk", async (req, res) => {
  const userIdString = (req.query.ids ?? "[]") as string;
  const userIds = userIdString.slice(1, userIdString?.length - 1).split(",");

  const metadata = await db.user.findMany({
    where: {
      id: userIds,
    },
    data: {
      avatar: true,
      id: true,
    },
  });

  res.json({
    avatars: metadata.map((m: any) => ({
      userId: m.id,
      avatarId: m.avatar?.imageUrl,
    })),
  });
});
