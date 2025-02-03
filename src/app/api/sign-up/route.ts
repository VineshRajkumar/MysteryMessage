import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user.model";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request:Request) {
    //give error if any other request is used instead of POST so that blank Response doesnot occur
    if(request.method !== 'POST' ){
        return Response
        .json(
            {
                success:false,
                
                message:'Use POST request'
            },{status:405}
        )
    } 

    await dbConnect()

    try {
        const {username,email,password} = await request.json()

        //find if username entered by a user is present in database
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified:true,//if he has done registeration by otp then is verfied user
        })
        //if username entered by user is present is database then tell username is taken since username should be unique 
        if(existingUserVerifiedByUsername){
            return Response.json({
                success:false,
                message:"Username is alredy taken"
            },{status:400})
        }

        const existingUserbyEmail = await UserModel.findOne({email})
        const verifyCode  = Math.floor(100000+Math.random()*900000).toString() //verifyCode is the otp to be sent

        if(existingUserbyEmail){
            //checking if email entered by user is alredy present in database:- 
            if(existingUserbyEmail.isVerified){
                return Response.json({
                    success:false,
                    message:"User alredy exist with this email"
                },{status:400})
            }
            //if user is not present in database then save the user
            else{
                const hashedPassword = await bcrypt.hash(password,10)
                existingUserbyEmail.password = hashedPassword,
                existingUserbyEmail.verifyCode  = verifyCode,
                existingUserbyEmail.verifyCodeExpiry = new Date(Date.now()+3600000) //Date.now returns the current timestamp in millisecond.
                await existingUserbyEmail.save()
            }
        }


        //if new user is registering
        else{
            const hashedPassword = await bcrypt.hash(password,10)
            const expiryDate = new Date() //otp expiryDate
            expiryDate.setHours(expiryDate.getHours()+1) //otp expiryDate is in 1hr, so in 1hr it will expire
            const newUser =  new UserModel({
                username, 
                email,
                password:hashedPassword,
                verifyCode:verifyCode, //verifyCode is the otp to be sent if new user registers
                verifyCodeExpiry:expiryDate, //this is the otp expiryDate 
                isVerified:false,
                isAcceptingMessage:true,
                message:[]

            })

            await newUser.save()
        }

        //send verification email with otp
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        //if emailResponse is false:-
        if(!emailResponse.sucess){
            return Response.json({
                success:false,
                message: emailResponse.message
            },{status:500})
        }
        //if emailResponse is true:-
        return Response.json({
            success:true,
            message:"User registered successfully.Please verify your email"
        },{status:201})

    } catch (error) {
        console.log('Error registering user',error)
        return Response.json(
            {
                success:false,
                message:"Error registering User"
            },
            {
                status:500
            }
        )
    }
}