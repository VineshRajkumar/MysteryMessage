import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import { User } from "next-auth";
import { z } from "zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema.forZod";


const AcceptMessagesQuerySchema = z.object({ //have not used now 
    isAcceptingMessage:acceptMessageSchema
})
//POST request here is to update the isAcceptingMessage of loggedin user
export async function POST(request:Request){
    await dbConnect() //DATABASE should be connected everythime becasue nextjs is edge time framewaork

    const session = await getServerSession(authOptions)//to get currently logged in user
    //this is the session that where we had put the value of user via token check in nextauth / options.ts file
    const user = session?.user //it will contain all user realted things like id,isVerified,isAcceptingMessages etc 
    console.log("user",user)
    if(!session||!session.user){ //if session not received the give error as he is not loggedin
        return Response.json(
            {
                success:false,
                message: "Not Authenticated"
            },{status:401})
    }
    const userId = user?._id; //get user id from 
    const {acceptMessages} = await request.json() //get json Response from user wheathe rhe is accepting message or not
    console.log("userid",userId)
    try {

        const updatedUser = await UserModel.findByIdAndUpdate( //find by id and update isAcceptingMessage
            userId,
            {isAcceptingMessage:acceptMessages},
            {new:true}
        )
        if(!updatedUser){ //if id not received the give error 
            return Response.json(
                {
                    success:false,
                    message: "User Not Updated"
                },{status:401}
            )
        }
        return Response.json(
            {
                success:true,
                message: "Message acceptance status Updated successfully",
                updatedUser
            },{status:200}
        )

    } catch (error) {
        return Response.json(
            {
                success:false,
                message: "Failed to update user status to Accepting message"
            },{status:500}
        )
    }
}

//GET request here is to get what user has said has he said to allow the messages or has he said to not allow the messages
export async function GET(request: Request){
    await dbConnect() //DATABASE should be connected everythime becasue nextjs is edge time framewaork

    const session = await getServerSession(authOptions)//to get currently logged in user
    //this is the session that where we had put the value of user via token check in nextauth / options.ts file
    const user = session?.user //it will contain all user realted things like id,isVerified,isAcceptingMessages etc 

    if(!session||!session.user){ //if session not received the give error as he is not loggedin
        return Response.json(
            {
                success:false,
                message: "Not Authenticated"
            },{status:401})
    }
    const userId = user?._id;  //get userid
    console.log("userid get",userId)
    try {
        const foundUser = await UserModel.findById(userId) //find userby userid
        if(!foundUser){ //if id not received the give error 
            return Response.json(
                {
                    success:false,
                    message: "User not found"
                },{status:404}
            )
        }

        return Response.json(
            {
                success:true,
                isAcceptingMessages:foundUser.isAcceptingMessage //get the isAcceptingMessage field from user
            },{status:200}
        )
    } catch (error) {
        return Response.json(
            {
                success:false,
                message: "Error in getting message acceptance status"
            },{status:500}
        )
    }
    

}