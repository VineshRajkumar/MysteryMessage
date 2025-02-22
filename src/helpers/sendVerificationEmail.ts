import { resend } from "@/lib/resend";
import AWSVerifyEmail from "../../emails/VerificationEmail";

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<ApiResponse>{
    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Mystry Message Verification Email',
            react: AWSVerifyEmail({verificationCode:verifyCode}),
          });

        return {sucess:true,message:'Verification Email sent Sucessfully'}

    } catch (emailError) {
        console.error("Error sending verification email",emailError)
        return {sucess:false, message:'Failed to send verification email'}
    }
}