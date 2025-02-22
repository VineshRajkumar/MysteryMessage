//NOTE :- CONSOLE.LOGS IN FRONTEND ARE ONLY VISIBLE IN WEBSITE CONSOLE OR BROWSER CONSOLE THEY ARE NOT VISIBLE IN CMD VS CODE CONSOLE. 
//SO IF YOU DID ANY CONSOLE.LOG IN FRONTEND CHECK BROWSER CONSOLE

'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form"
import * as z from "zod" //* will import everything from zod libaray
import { useState,useEffect } from "react"

import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"



import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema.forZod"
import { signIn } from "next-auth/react"


const Page = () => {

    const [issubmitting, setisSubmitting] = useState(false) //is form submitted - A boolean that indicates if the form is currently being submitted.
    const { data: session, status } = useSession();

    const { toast } = useToast()
    const router = useRouter() //allows for navigation between pages.


    useEffect(() => {
        if (status === "authenticated") {
            router.push("/dashboard");
        }
    }, [status, router]);


    //infer means interface
    const form = useForm<z.infer<typeof signInSchema>>({ //<z.infer<typeof signInSchema>> this is written becuase of typescript error handling feature because of this it will become conform that zod will follow signInSchema
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',//clean up form once submitted
            password: '' //clean up form once submitted
        }
    })

    const onSubmit = async (data: z.infer<typeof signInSchema>) => { //onsubmit will pass through handlesubmit
        setisSubmitting(true)

        const result = await signIn('credentials', { //this is the method to do singin using nextauth we have Already written it in options.ts file in auth/nextauth
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })
        console.log("result is ", result)
        if (result?.error) {
            toast({
                title: "Login Failed",
                description: result.error,
                variant: "destructive"
            })
        }
        setisSubmitting(false)

        if(result?.url){
            router.push('/dashboard')
        }

    }

    return (
        <div>

            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-20">
                            Welcome Back!!
                        </h1>
                    </div>
                    <div>
                        {/* //taken directly from shadcn form templete */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                                <FormField
                                    name="identifier"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email / Username</FormLabel>
                                            <FormControl>
                                                {/* email will automatically go as form is submitted */}
                                                <Input placeholder="email / username" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="password"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                {/* email will automatically go as form is submitted */}
                                                <Input type="password" placeholder="password" {...field} />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-center">
                                    <Button type="submit" disabled={issubmitting}>
                                        {
                                            issubmitting ? (
                                                <div>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                                </div>
                                            ) : ('Log In')
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>


                    </div>
                </div>
            </div>

        </div>
    )
}
export default Page
