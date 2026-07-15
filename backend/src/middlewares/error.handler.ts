import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// Fetching status code and message
// Then sending it to user
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