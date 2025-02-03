import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {boolean, z} from 'zod'
import { verifySchema } from "@/schemas/verifySchema.forZod";

export async function GET(request:Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const username = searchParams.get('username')
        console.log(username)
        if(!username){
            return Response
            .json(
                {
                    success:false,
                    message: 'Username is empty'
                },{status:400}
            )
        }
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:500})
        }

        if(user?.isVerified==true){
            return Response.json({
                success:true,
                message:"User is Verifed"
            },{status:200})
        }
        else{
            return Response.json({
                success:false,
                message:"User is not Verifed"
            },{status:200})
        }

    } catch (error) {
        console.log("Error getting user Verification",error)
        return Response.json(
            {
                success:false,
                message:"Error getting user Verification"
            },{status:500}
        )
    }
}