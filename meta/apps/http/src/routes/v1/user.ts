import { Request, Response, Router } from "express";
import { updateMetadataSchema } from "../../types";
import { userMiddleWare } from "../../middleware/user";
import db from "@repo/db/db";

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
  try {
    const userIdString = (req.query.ids ?? "[]") as string;
    const userIds = JSON.parse(userIdString); // Parse the string into an array of IDs

    if (!Array.isArray(userIds)) {
       res.status(400).json({
        message: "Invalid query parameter. 'ids' should be an array.",
      });
      return;
    }

    const metadata = await db.user.findMany({
      where: {
        id: {
          in: userIds, // Use the 'in' filter for querying multiple IDs
        },
      },
      select: {
        avatar: true, // Select the avatar relation
        id: true, // Select the user ID
      },
    });

    res.json({
      avatars: metadata.map((m: any) => ({
        userId: m.id,
        avatarId: m.avatar?.imageUrl,
      })),
    });
  } catch (err) {
    res.status(500).json({
      message: `Failed to fetch metadata: ${err}`,
    });
  }
});
