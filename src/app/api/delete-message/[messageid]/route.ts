import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";


export async function DELETE(request:Request,{params}:{params:{messageid:string}}){
    const messageid =params.messageid
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
    try {
        const updateResult =  await UserModel.updateOne(
            {_id: user?._id}, 
            //we will be delteing the document of messages using $pull this is built in mongodb function to delete document 
            {$pull:{message:{_id:messageid}}} //The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
        )
        if(updateResult.modifiedCount == 0){ //document not deleted
            return Response.json(
                {
                    success:false,
                    message: "Message not found or Message alredy deleted"
                },{status:401})

        }
        return Response.json({
            success:true,
            message: "Message Deleted"
        },{status:200})

    } catch (error) {

        return Response.json({
            success:false,
            message: "Error Deleting Message"
        },{status:500})

    }
    

}