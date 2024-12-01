import { Router } from "express";
import db from "@repo/db/db";
import { adminMiddleware } from "../../middleware/admin";
import {
  createAvatarSchema,
  createElementSchema,
  createMapSchema,
  updateElementSchema,
} from "../../types";

export const adminRouter = Router();

adminRouter.post("/element", adminMiddleware, async (req, res) => {
  //create an element
  const parsedData = createElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Validation failed",
    });
    return;
  }

  const element = await db.element.create({
    data: {
      width: parsedData.data.width,
      height: parsedData.data.height,
      static: parsedData.data.static,
      imageUrl: parsedData.data.imageUrl,
    },
  });

  res.json({
    message: "Element created",
    id: element.id,
  });
});

adminRouter.put("/element/:elementId", async (req, res) => {
  // update an element

  const parsedData = updateElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Validation failed",
    });
    return;
  }

  const element = await db.element.update({
    where: {
      id: req.params.elementId,
    },
    data: {
      imageUrl: parsedData.data.imageUrl,
    },
  });

  res.json({
    message: "Element updated",
    imageUrl: element.imageUrl,
  });
});

adminRouter.post("/avatar", async (req, res) => {
  //create an avatar
  const parsedData = createAvatarSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      message: "Validation failed",
    });
    return;
  }

  const avatar = await db.avatar.create({
    data: {
      name: parsedData.data.name,
      imageUrl: parsedData.data.imageUrl,
    },
  });

  res.json({
    message: "Avatar created",
    id: avatar.id,
  });
});

adminRouter.post("/map", async (req, res) => {
  //create a map
  const parsedData = createMapSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      message: "Validation failed",
    });
    return;
  }

  const map = await db.map.create({
    data: {
      name: parsedData.data.name,
      thumbnail: parsedData.data.thumbnail,
      height: parsedData.data.dimensions.split("x")[1],
      width: parsedData.data.dimensions.split("x")[0],
      elements: {
        create: parsedData.data.defaultElements.map((e) => ({
          elementId: e.elementId,
          x: e.x,
          y: e.y,
        })),
      },
    },
  });

  res.json({
    message: "Map created",
    id: map.id,
  })
});
