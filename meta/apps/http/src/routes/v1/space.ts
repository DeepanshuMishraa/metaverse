import { Router } from "express";
import { userMiddleWare } from "../../middleware/user";
import {
  addElementSchema,
  createSpaceSchema,
  DeleteElementSchema,
} from "../../types";
export const spaceRouter = Router();
import db from "@repo/db/db";

spaceRouter.post("/", userMiddleWare, async (req, res) => {
  const parsedData = createSpaceSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Validation failed",
    });
    return;
  }

  if (!parsedData.data.mapId) {
    const space = await db.space.create({
      data: {
        name: parsedData.data.name,
        width: parsedData.data.dimensions.split("x")[0],
        height: parsedData.data.dimensions.split("x")[1],
        creatorId: req.userId,
      },
    });

    res.json({
      message: "Space Created",
      spaceId: space.id,
    });
  }

  const map = await db.map.findUnique({
    where: {
      id: parsedData.data.mapId,
    },
    select: {
      elements: true,
      width:true,
      height:true
    },
  });

  if (!map) {
    res.json({
      message: "Map not found",
    });
    return;
  }

  let space = await db.$transaction(async () => {
    const space = await db.space.create({
      data: {
        name: parsedData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId,
      },
    });

    await db.spaceElements.createMany({
      data: map.elements.map((e) => ({
        spaceId: space.id,
        elementId: e.elementId,
        x: e.x as number,
        y: e.y as number,
      })),
    });

    return space;
  });

  res.json({
    message: "Space Created",
    spaceId: space.id,
  });
});

