export const dynamic = "force-dynamic";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";

export async function GET(request:Request){
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url) //get the url 
        const username = searchParams.get('username') //get the username from it
        if(!username){
            return Response
            .json({
                success:false,
                message: 'Didnot get Username from URL'
            },{status:400})
        }
        
        // const exisitingVerifiedUser = await UserModel.find({username,isVerified:true})
        
        const exisitingVerifiedUser = await UserModel.find({
            username:{
                $regex:`^${username}`,
                $options: 'i'
            },
            isVerified:true
        }).limit(10).select('username -_id' );


        if(exisitingVerifiedUser.length === 0){
            return Response
            .json({
                success:false,
                message: 'Username not Found'
            },{status:400})
        }
        return Response
            .json({
                success:true,
                message: 'Username Found',
                messages: exisitingVerifiedUser
            },{status:200})


    } catch (error) {
        console.log("Error fetching username",error)
        return Response.json(
            {
                success:false,
                message:"Error fetching username"
            },{status:500}
        )
    }
}
