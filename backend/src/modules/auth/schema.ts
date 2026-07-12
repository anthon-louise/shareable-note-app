import {z} from "zod";

export const registerUserSchema = z.object({
    username:
        z.string()
        .min(2, "Name is too short")
        .max(50, "Name is too long")
        .trim(),
    email:
        z.email("Please provide email")
        .trim(),
    password:
        z.string()
        .min(2, "Password too short")
        .max(100, "Password too long"),
});

export const loginUserSchema = z.object({
    email:
        z.email("Please provide email")
        .trim(),
    password: 
        z.string()
        .min(2, "Password too short"),
})