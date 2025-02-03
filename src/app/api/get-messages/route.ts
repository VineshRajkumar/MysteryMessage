import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import mongoose from "mongoose";


export async function GET(request:Request){
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
    const userId = new mongoose.Types.ObjectId(user?._id); //get user id -> since here user id is in string so convert to back to mongoose id so that when aggregation pipeline is implemented it doesnot give error 
    // console.log("userId from getmessages",userId)
    try {
        const user = await UserModel.aggregate([
            {$match: {_id:userId}}, //match will get that Document of that particular user
            {$unwind: '$message'}, //unwind will seerate the array of messages such that each new Document is made for that particular message with each containing a username and _id // we are doing this to sort the documents with the latest message to appear at the top
            {$group:{_id:'$_id',message:{$push:'$message'}}} //group all the messages with that particular user id 
        ])
        // console.log(user)
        if(!user||user.length===0){
            return Response.json(
                {
                    success:false,
                    message: "User not found"
                },{status:401})
        }

        return Response.json(
            {
                success:true,
                message: user[0].message  //get the first document related to that user
            },{status:200})
    } catch (error) {
        console.log("An unexpected error happended ",error)
        return Response.json(
            {
                success:false,
                message: "Messages not received"
            },{status:500}
        )
    }

}