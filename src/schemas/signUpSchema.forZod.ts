//ZOD IS USED FOR VALIDATION , IF THINGS USER IS ENTERING IS CORRECT OR WRONG EG:- EMAIL ID SHOULD BE LIKE - vineshraj@gmail.com wheather this contains @ and .com these are checked by zod npm package

import { use } from "react";
import { z } from "zod";

//THIS IS ONE WAY TO CHECK VALIDATION BY ZOD
export const usernameValidation = z
.string() // username should be a string ->validation checked by ZOD
.min(2,"Username must be atleast 2 characters")
.max(20,"Username must be no more than 20 characters")
.regex(/^[a-zA-Z][a-zA-Z0-9_]{2,15}$/ ,"Username must not contain special characters") //this long string that is written here is called regexr and this will check if username has either lowercase a-z or uppercase A-Z and has 2 and 15 characters (combined with the initial letter, this makes the total length 3 to 16 characters) in it all these will be checked if it is correct then it will proceed -> regexr is generally used for these type of validations

//ANOTHER WAY OF CHECKING USING ZOD
export const singUpSchema = z.object({
    username:usernameValidation,
    email: z.string().email({message:"Invalid Email Address"}), //.email() is inbuilt in zod will automatically check email 
    password: z.string().min(6,{message:"Password must be at least 6 characters"})
})

