import z from "zod";

export const signUpSchema = z.object({
  username: z.string().min(3).max(255),
  email: z.string().email(),
  password: z.string().min(5).max(255),
  name: z.string().min(3).max(255),
  type: z.enum(["user", "admin"]),
});

export const signInSchema = z.object({
  username: z.string(),
  password: z.string().min(5).max(255),
});

export const updateMetadataSchema = z.object({
  avatarId: z.string(),
});

export const createSpaceSchema = z.object({
  name: z.string().min(3).max(255),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  mapId: z.string(),
});

export const addElementSchema = z.object({
  spaceId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
});

export const createElementSchema = z.object({
  imageUrl: z.string().url(),
  width: z.number(),
  height: z.number(),
  static: z.boolean(),
});

export const updateElementSchema = z.object({
  imageUrl: z.string().url(),
});

export const createAvatarSchema = z.object({
  name: z.string(),
  imageUrl: z.string().url(),
});

export const createMapSchema = z.object({
  thumbnail: z.string(),
  dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/),
  defaultElements: z.array(
    z.object({
      elementId: z.string(),
      x: z.number(),
      y: z.number(),
    })
  ),
});

declare global {
  namespace Express {
    export interface Request {
      userId: string;
      role?: "Admin" | "User";
    }
  }
}

export type signUpSchemaType = z.infer<typeof signUpSchema>;
export type signInSchemaType = z.infer<typeof signInSchema>;
export type updateMetadataSchemaType = z.infer<typeof updateMetadataSchema>;
export type createSpaceSchemaType = z.infer<typeof createSpaceSchema>;
export type addElementSchemaType = z.infer<typeof addElementSchema>;
export type createElementSchemaType = z.infer<typeof createElementSchema>;
export type updateElementSchemaType = z.infer<typeof updateElementSchema>;
export type createAvatarSchemaType = z.infer<typeof createAvatarSchema>;
export type createMapSchemaType = z.infer<typeof createMapSchema>;
