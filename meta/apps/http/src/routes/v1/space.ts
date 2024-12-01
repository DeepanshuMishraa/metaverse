import { Router } from "express";
import { userMiddleWare } from "../../middleware/user";
import {
  addElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "../../types";
export const spaceRouter = Router();
import db from "@repo/db/db";

spaceRouter.post("/", userMiddleWare, async (req, res) => {
  const parsedData = CreateSpaceSchema.safeParse(req.body);

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
      width: true,
      height: true,
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

spaceRouter.delete("/:spaceId", userMiddleWare, async (req, res) => {
  const space = await db.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
  });

  if (!space) {
    res.status(400).json({
      message: "Space doesnt existt",
    });

    return;
  }

  if (space.creatorId !== req.userId) {
    res.status(403).json({
      message: "You are not the creator of this space",
    });

    return;
  }

  await db.space.delete({
    where: {
      id: req.params.spaceId,
    },
  });

  res.status(201).json({
    message: "Space Deleted Successfully",
  });
});

spaceRouter.get("/all", userMiddleWare, async (req, res) => {
  const spaces = await db.space.findMany({
    where: {
      creatorId: req.userId,
    },
  });

  if (!spaces) {
    res.status(400).json({
      message: "User doesnt have any spaces",
    });
    return;
  }

  res.status(200).json({
    spaces: spaces,
  });
});

spaceRouter.post("/element", userMiddleWare, async (req, res) => {
  const parsedData = addElementSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(401).json({
      message: "Validation Error",
    });

    return;
  }

  const space = await db.space.findUnique({
    where: {
      id: req.body.spaceId,
      creatorId: req.userId,
    },
    select: {
      width: true,
      height: true,
    },
  });

  if (!space) {
    res.status(400).json({
      message: "Space doesnt exist",
    });
    return;
  }

  await db.spaceElements.create({
    data: {
      spaceId: req.body.spaceId,
      elementId: req.body.elementId,
      x: req.body.x,
      y: req.body.y,
    },
  });

  res.status(201).json({
    message: "Element added successfully",
  });
});

spaceRouter.delete("/element", userMiddleWare, async (req, res) => {
  const parsedData = DeleteElementSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(401).json({
      message: "Validation Error",
    });

    return;
  }

  const element = await db.spaceElements.findFirst({
    where: {
      id: parsedData.data.id,
    },
    include: {
      space: true,
    },
  });

  if (!element) {
    res.status(400).json({
      message: "Element doesnt exist",
    });

    return;
  }

  if (element.space.creatorId !== req.userId) {
    res.status(403).json({
      message: "You are not the creator of this space",
    });

    return;
  }

  await db.spaceElements.delete({
    where: {
      id: parsedData.data.id,
    },
  });

  res.status(201).json({
    message: "Element deleted successfully",
  });
});

spaceRouter.get("/:spaceId", async (req, res) => {
  // get a particular space

  const space = await db.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    include: {
      elements: {
        include:{
            element:true,
        }
      }
    },
  });

  if (!space) {
    res.status(400).json({
      message: "Space doesnt exist",
    });

    return;
  }

  res.status(200).json({
    dimensions: `${space.width}x${space.height}`,
    elements: space.elements,
  });
});
