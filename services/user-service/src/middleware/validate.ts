import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

/**
 * validateBody(schema) - validates req.body
 * validateQuery(schema) - validates req.query
 * On error returns 400 with details.
 */

export function validateBody<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid request body", details: result.error.format() });
    }
    // replace req.body with parsed typed object (removes unknowns)
    req.body = result.data;
    next();
  };
}

export function validateQuery<T extends ZodSchema>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({ error: "Invalid query params", details: result.error.format() });
    }
    req.query = result.data as any;
    next();
  };
}