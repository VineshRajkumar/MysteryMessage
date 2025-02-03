import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import {z} from 'zod'
import { verifySchema } from "@/schemas/verifySchema.forZod";


const VerifyCodeQuerySchema = z.object({
    verifyCode:verifySchema
})

export async function POST(request:Request){
    await dbConnect() //DATABASE should be connected everythime becasue nextjs is edge time framewaork
    try {
        const {searchParams} = new URL(request.url) //get the url 
        // console.log(searchParams)
        const queryParam = {
            verifyCode:{
                code:searchParams.get('verifyCode')
            }, //get the verifyCode from it
            
        }
        // console.log(queryParam)
        //validating with zod
        const result = VerifyCodeQuerySchema.safeParse(queryParam) //safeParse will check if the regex is follwed
        // console.log(result)
        //if regex is not followed then give error 

        if(!result.success){ 
            return Response
            .json(
                {
                    success:false,
                    message: result.error.issues.map(issue => issue.message) //will give error message written in zod
                },{status:400}
            )

        }

        const {verifyCode} = result.data 
        const code = verifyCode.code
        // console.log(code)
        
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
        
        const decodedUsername = decodeURIComponent(username) //this will decode the thing that go to url so that it is decoded
        // console.log(decodedUsername)
        const user = await UserModel.findOne({username:decodedUsername})
        if(!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{status:500})
        }

        const isCodeValid = user.verifyCode === code
        const isCodenotExpired = new Date(user.verifyCodeExpiry) > new Date()
        if(isCodeValid&&isCodenotExpired){
            user.isVerified = true,
            await user.save()

            return Response.json({
                success:true,
                message:"Account Verifed Sucessfully"
            },{status:200})
        }
        else if(!isCodenotExpired){
            return Response.json({
                success:false,
                message:"Verification code expired. Please singUp again"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"Incorrect Verification Code"
            },{status:400})
        }

    } catch (error) {

        console.log("Error verifiying user",error)
        return Response.json(
            {
                success:false,
                message:"Error verifiying user"
            },{status:500}
        )
    }
}