import { z } from "zod";
export const signInSchema = z.object({
    identifier:z.string(), //identifier is basically username or email
    password: z.string()    
})