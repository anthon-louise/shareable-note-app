import z from "zod";

// note schema
export const noteSchema = z.object({
    title:
        z.string()
        .min(1, "Title is required")
        .max(50, "Title is too long"),
    content:
        z.string()
        .min(1, "Content is required")
});

// share note schema
export const shareNoteSchema = z.object({
    email:
        z.email({message: "Invalid email"})
});