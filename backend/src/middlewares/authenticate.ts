import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            const error: any = new Error("Not authenticated");
            error.status = 401;
            return next(error);
        }

        const decoded = jwt.verify(token, process.env.SECRET as string);
        (req as any).user = decoded;
        next();
    } catch (err: any) {
        const error: any = new Error("Invalid token or expired token");
        error.status = 401;
        next(error);
    }
}