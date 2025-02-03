//NOTE ;- NEXTAUTH DOCUMENTAION IS VERY OLD SO THIS IS THE WAT IT IS WRITTEN

import { authOptions } from "./options"; //made this file in options.ts
import NextAuth from "next-auth/next";

//NOTE: WHY HAVE WE WRITTEN CredentialsProvider IN SEPERATE FILE BECAUSE IF 
//YOU NEED TO IMPLEMENT GITHUB PROVIDER LATER THEN YOU CAN JUST PUT IT IN THAT FILE
//IN THIS WAY CODE WILL BE NEAT AND CLEAN AND READEBLE 
//SO ALWAYS MAKE TWO FILES IF YOU WANT TO USE NEXTAUTH - options.ts and route.tz

const handler = NextAuth(authOptions) //importing authOptions from options.tz
export {handler as GET,handler as POST} //this is syntax of nextauth no explaination for this 