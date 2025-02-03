//REMEMBER WE ARE USING ZOD ONLY TO CHECK IF USERNAME OR THE THING MENTIONED IS VALID OR NOT(LIKE WHEATHER IT CONTAINES @ ETC LIKE THAT ) WE ARE NOT CHECKING WHETHER IT EXISTS IN DATABASE OR NOT HERE 
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema.forZod";

//we will check if username is taken or not using query paramter which appears as question mark in urls
//how does query paramter apper in url  -> localhost:300/api/check-username-unique?username=vinesh <-likethis
const UsernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(request:Request){

    //give error if any other request is used instead of get so that blank Response doesnot occur
    // console.log(request.method)
    if(request.method !== 'GET' ){
        return Response
        .json(
            {
                success:false,
                
                message:'Use GET request'
            },{status:405}
        )
    } 

    await dbConnect() //DATABASE should be connected everythime becasue nextjs is edge time framewaork
    //how does query paramter apper in url  -> localhost:300/api/check-username-unique?username=vinesh <-likethis
    //we will not redirect user to another apge we will just check the query 
    try {
        const {searchParams} = new URL(request.url) //get the url 
        const queryParam = {
            username:searchParams.get('username') //get the username from it
        }
        //validating with zod
        const result = UsernameQuerySchema.safeParse(queryParam) //safeParse will check if the regex is follwed
        // console.log(result)
        //if regex is not followed then give error 

        if(!result.success){ //.format is written to only give errors of username
            const usernameErrors = result.error.format().username?._errors || [] //if errors not found return null
            return Response
            .json(
                {
                    success:false,
                    //if usernameErrors length is greater than 0 then give all the error seoerated by commas
                    message: usernameErrors?.length>0?usernameErrors.join(',') : 'Invalid query parameter'
                },{status:400}
            )

        }
        // console.log(result)
        const {username} =result.data

        const exisitingVerifiedUser = await UserModel.findOne({username,isVerified:true})
        // console.log(exisitingVerifiedUser)
        if(exisitingVerifiedUser){
            return Response
            .json({
                success:false,
                message: 'Username is alredy taken'
            },{status:400})
        }
        return Response
            .json({
                success:true,
                message: 'Username is unique'
            },{status:400})


    } catch (error) {
        console.log("Error checking username",error)
        return Response.json(
            {
                success:false,
                message:"Error checking username"
            },{status:500}
        )
    }
}