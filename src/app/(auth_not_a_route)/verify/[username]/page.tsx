//NOTE :- CONSOLE.LOGS IN FRONTEND ARE ONLY VISIBLE IN WEBSITE CONSOLE OR BROWSER CONSOLE THEY ARE NOT VISIBLE IN CMD VS CODE CONSOLE. 
//SO IF YOU DID ANY CONSOLE.LOG IN FRONTEND CHECK BROWSER CONSOLE

'use client'

import Link from "next/link"
import { Form } from "@/components/ui/form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { verifySchema } from '@/schemas/verifySchema.forZod'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from "@/components/ui/button"
import axios, { AxiosError } from 'axios'
import { redirect, useParams, useRouter } from 'next/navigation'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

const Page = () => {
    // const [verificationCode, setVerificationCode] = useState('')
    const router = useRouter() //for redirection
    const params = useParams<{ username: string }>()//capture username using params  <{username:string}> <-- this is written because of typescript
    const { toast } = useToast()

    // console.log(verifySchema)
    const form = useForm<z.infer<typeof verifySchema>>({ //<z.infer<typeof verifySchema>> this is written becuase of typescript error handling feature because of this it will become conform that zod will follow verifySchema
        
        resolver: zodResolver(verifySchema),
        // defaultValues: { code: verificationCode}
    })

    // console.log("form is")
    // console.log(form)
    // console.log("Form values:", form.getValues()); 
    // console.log("code is",verificationCode)
    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        // console.log("Form submitted:", data);
        try {

            // console.log(data.code)
            const response = await axios.post<ApiResponse>(`/api/verify-code?username=${params.username}&verifyCode=${data.code}`,
                {
                    username: params.username,
                    code: data.code
                    
                }
            )
            toast({
                title: 'Success',
                description: response.data.message

            })

            router.push('/sign-in')
            
            
        } catch (error) {
            // console.log(data)
            const axiosError = error as AxiosError<ApiResponse>
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Verification failed",
                description: errorMessage,
                variant: "destructive"
            })

        }
    }
    return (
        <div>
            <div>
                <div className="flex justify-center items-center min-h-screen bg-gray-100">
                    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                        <div className="text-center">
                            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                                Verify Your Account
                            </h1>
                            <p className="mb-4">
                                Enter the Verification code sent to your email
                            </p>
                        </div>
                        <div>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Verification Code</FormLabel>
                                                <FormControl>
                                                    {/* <Input placeholder="code" {...field}/> */}
                                                   
                                                    <div className="flex justify-center ">
                                                        <InputOTP maxLength={6} {...field}>
                                                            <InputOTPGroup>
                                                                <InputOTPSlot index={0} className="border-black border-[1px]" />
                                                                <InputOTPSlot index={1} className="border-black border-[1px]"/>
                                                                <InputOTPSlot index={2} className="border-black border-[1px]"/>
                                                                <InputOTPSlot index={3} className="border-black border-[1px]"/>
                                                                <InputOTPSlot index={4} className="border-black border-[1px]"/>
                                                                <InputOTPSlot index={5} className="border-black border-[1px]"/>
                                                            </InputOTPGroup>
                                                        </InputOTP>


                                                    </div>
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Submit</Button>
                                </form>
                                
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
