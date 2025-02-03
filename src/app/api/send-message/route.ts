import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { messageSchema } from "@/schemas/messageSchema.forZod";
import { z } from "zod";
import mongoose from "mongoose";
import { Message } from "@/model/user.model";
import { use } from "react";

const MessageQuerySchema = z.object({
    message:messageSchema
})

export async function POST(resquest:Request){
    await dbConnect()
    const {username,content} = await resquest.json()


    try {
        //find the user 
        const user = await UserModel.findOne({username})

        if(!user){
            return Response.json(
            {
                success:false,
                message:  "User not found" 
            },{status:404}
        )
        }
        
        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json(
                {
                    success:false,
                    message:  "User not accepting the message" 
                },{status:403})
        }
        
        //checking validation with ZOD
        const queryParam = {
            message:{
                content:content
            }, //get the verifyCode from it
        }
        const checkcontent = MessageQuerySchema.safeParse(queryParam)
        if(!checkcontent.success){
            return Response
            .json(
                {
                    success:false,
                    message:  checkcontent.error.issues.map(issue => issue.message) //will give error message written in zod
                },{status:400}
            )}

            const {message} = checkcontent.data  //extract content after checking it validation
            const checkedcontent = message.content
        const newMessage = {content:checkedcontent,username} 
        user.message.push(newMessage as Message) //as Message is done because in user.model.ts we said that content should be string type and we told that in MessageSchema should contain strictly the parameter of Message interface
        await user.save()

        return Response.json(
            {
                success:true,
                message:  "Message sent successfully" 
            },{status:200})

    } catch (error) {

        console.log("Error adding messages ",error)
        return Response.json(
            {
                success:false,
                message: "Internal Server Error "
            },{status:500}
        )
    }

}