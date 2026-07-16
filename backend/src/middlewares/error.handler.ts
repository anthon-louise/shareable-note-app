import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

// This is function handles error that are thrown in the application
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    // status code and message are the properties defined with the error instance
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error"
    
    // logs the error details for debugging
   console.error(`Error: ${err}, Status: ${statusCode}, message: ${message}`);

    // if the error is from zod then show zod error message
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            error: {
                message: err.issues[0].message
            }
        })
    }

    // general response object for errors passed
    res.status(statusCode).json({
        success: false,
        error: {
            message
        }
    })
};