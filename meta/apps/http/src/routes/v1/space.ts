import { Router } from "express";
import { userMiddleWare } from "../../middleware/user";
import { addElementSchema, createSpaceSchema, DeleteElementSchema } from "../../types";
export const spaceRouter = Router();
const db = require("@repo/db/client")

spaceRouter.post("/", userMiddleWare, async (req, res) => {
    console.log("endopibnt")
    const parsedData = createSpaceSchema.safeParse(req.body)
    if (!parsedData.success) {
        console.log(JSON.stringify(parsedData))
        res.status(400).json({message: "Validation failed"})
        return
    }

    if (!parsedData.data.mapId) {
        const space = await db.space.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
            }
        });
        res.json({spaceId: space.id})
        return;
    }

    const map = await db.map.findFirst({
        where: {
            id: parsedData.data.mapId
        }, select: {
            mapElements: true,
            width: true,
            height: true
        }
    })
    console.log("after")
    if (!map) {
        res.status(400).json({message: "Map not found"})
        return
    }
    console.log("map.mapElements.length")
    console.log(map.mapElements.length)
    let space = await db.$transaction(async () => {
        const space = await db.space.create({
            data: {
                name: parsedData.data.name,
                width: map.width,
                height: map.height,
                creatorId: req.userId!,
            }
        });

        await db.spaceElements.createMany({
            data: map.mapElements.map((e:any) => ({
                spaceId: space.id,
                elementId: e.elementId,
                x: e.x!,
                y: e.y!
            }))
        })

        return space;

    })
    console.log("space crated")
    res.json({spaceId: space.id})
})


spaceRouter.delete("/element", userMiddleWare, async (req, res) => {
    console.log("spaceElement?.space1 ")
    const parsedData = DeleteElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const spaceElement = await db.spaceElements.findFirst({
        where: {
            id: parsedData.data.id
        },
        include: {
            space: true
        }
    })
    console.log(spaceElement?.space)
    console.log("spaceElement?.space")
    if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
        res.status(403).json({message: "Unauthorized"})
        return
    }
    await db.spaceElements.delete({
        where: {
            id: parsedData.data.id
        }
    })
    res.json({message: "Element deleted"})
})

spaceRouter.delete("/:spaceId", userMiddleWare, async(req, res) => {
    console.log("req.params.spaceId", req.params.spaceId)
    const space = await db.space.findUnique({
        where: {
            id: req.params.spaceId
        }, select: {
            creatorId: true
        }
    })
    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }

    if (space.creatorId !== req.userId) {
        console.log("code should reach here")
        res.status(403).json({message: "Unauthorized"})
        return
    }

    await db.space.delete({
        where: {
            id: req.params.spaceId
        }
    })
    res.json({message: "Space deleted"})
})

spaceRouter.get("/all", userMiddleWare, async (req, res) => {
    const spaces = await db.space.findMany({
        where: {
            creatorId: req.userId!
        }
    });

    res.json({
        spaces: spaces.map((s:any) => ({
            id: s.id,
            name: s.name,
            thumbnail: s.thumbnail,
            dimensions: `${s.width}x${s.height}`,
        }))
    })


})

spaceRouter.post("/element", userMiddleWare, async (req, res) => {
    const parsedData = addElementSchema.safeParse(req.body)
    if (!parsedData.success) {
        res.status(400).json({message: "Validation failed"})
        return
    }
    const space = await db.space.findUnique({
        where: {
            id: req.body.spaceId,
            creatorId: req.userId!
        }, select: {
            width: true,
            height: true
        }
    })

    if(req.body.x < 0 || req.body.y < 0 || req.body.x > space?.width! || req.body.y > space?.height!) {
        res.status(400).json({message: "Point is outside of the boundary"})
        return
    }

    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }
    await db.spaceElements.create({
        data: {
            spaceId: req.body.spaceId,
            elementId: req.body.elementId,
            x: req.body.x,
            y: req.body.y
        }
    })

    res.json({message: "Element added"})
})

spaceRouter.get("/:spaceId",async (req, res) => {
    const space = await db.space.findUnique({
        where: {
            id: req.params.spaceId
        },
        include: {
            elements: {
                include: {
                    element: true
                }
            },
        }
    })

    if (!space) {
        res.status(400).json({message: "Space not found"})
        return
    }

    res.json({
        "dimensions": `${space.width}x${space.height}`,
        elements: space.elements.map((e:any) => ({
            id: e.id,
            element: {
                id: e.element.id,
                imageUrl: e.element.imageUrl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static
            },
            x: e.x,
            y: e.y
        })),
    })
})
