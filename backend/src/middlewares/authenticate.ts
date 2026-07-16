import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// This function authenticates user by verifying jwt token stored in cookies.
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {

        // get token from cookies
        const token = req.cookies?.token;

        // if no token then a user will not be authenticated
        if (!token) {
            const error: any = new Error("Not authenticated");
            error.status = 401;
            return next(error);
        }

        // verify the token
        const decoded = jwt.verify(token, process.env.SECRET as string);

        // if the token is verified attach the token to req.user
        (req as any).user = decoded;

        next();
    } catch {

        // if the token is not valid then throw error
        const error: any = new Error("Invalid token or expired token");
        error.status = 401;
        next(error);
    }
}