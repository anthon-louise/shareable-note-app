import { Request, Response, NextFunction } from "express";
import { success, ZodError } from "zod";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error"
    
    console.error(`Error: ${err}, Status: ${statusCode}, message: ${message}`);

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: {
                message: err.issues[0].message
            }
        })
    }

    res.status(statusCode).json({
        success: false,
        error: {
            message
        }
    })
};