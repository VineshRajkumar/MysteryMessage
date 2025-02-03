//NOTE ;- NEXTAUTH DOCUMENTAION IS VERY OLD SO THIS IS THE WAT IT IS WRITTEN

//This is basically a signin or login page
//nextauthoptions are written here 
//basically use are using nextauth for it to handle all credentials stuff and if we want custom sinup we are writing it in authorize fucntion
import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { redirect } from "next/dist/server/api-utils";

export const authOptions: NextAuthOptions={
    
    providers:[
        CredentialsProvider({
            id: "credentials",//not much useful just written
            name: "Credentials", //not much useful just written
            //this is the main part:-
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Email" },
                password: { label: "Password", type: "password" }
              },
              async authorize(credentials:any):Promise<any>{
                await dbConnect()
                try {
                    const user = await UserModel.findOne({
                        $or:[
                            {email:credentials.identifier}, //if person give email or username
                            {username:credentials.identifier}
                        ]
                    })
                    console.log("UserIdfromOptionsFile",user?._id?.toString())
                    if(!user){
                        throw new Error("No user found with this Email")
                    }

                    //custom credentials
                    if(!user.isVerified){
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password,user.password) //compare password that is typed  by user and password that is alredy there in database
                    if(isPasswordCorrect){
                        return user //this return user thing is must as nextauth credentials expects this to return 
                    }
                    else{
                        throw new Error("Incorrect Password")
                    }
                    

                } catch (err:any) {
                    throw new Error(err)
                }
              }
        })
    ],
    //callbacks are use to modify if you have created custom CredentialsProvider
    callbacks: {
        //benefit of this callbacks is that now user details are all stored inside token and session so either you can you token or session to get user details again and again this way you wouldnot need to call the database again and again this will prevent database from choking
        async session({ session, token }) {
            if(token){
                //nextauth package has been mofied to handle _id, username these all check in types/next-auth.d.ts file
                session.user._id = token._id,
                session.user.isVerified = token.isVerified,
                session.user.isAcceptingMessages= token.isAcceptingMessages,
                session.user.username = token.username
            }
            return session //nextauth expects this to return once finished
        },
        async jwt({ token, user}) { //user here is from the CredentialsProvider which we returned
            if(user){
                //nextauth package has been mofied to handle _id, username these all check in types/next-auth.d.ts file
                token._id = user._id?.toString(), 
                token.isVerified = user.isVerified,
                token.isAcceptingMessages = user.isAcceptingMessages,
                token.username = user.username
            }
            return token //nextauth expects this to return once finished
        },
       
    },
    pages: { //overwrite the signIn page and will automatically design the signIn page
        signIn: '/sign-in' //this automatically create the login page or signIn page and it will overwrite the route 
    },

    session:{
        strategy:"jwt"
    },
    secret: process.env.NEXTAUTH_SECRET


    
}