//NOTE :- CONSOLE.LOGS IN FRONTEND ARE ONLY VISIBLE IN WEBSITE CONSOLE OR BROWSER CONSOLE THEY ARE NOT VISIBLE IN CMD VS CODE CONSOLE. 
//SO IF YOU DID ANY CONSOLE.LOG IN FRONTEND CHECK BROWSER CONSOLE


'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useForm } from "react-hook-form"
import * as z from "zod" //* will import everything from zod libaray
import { useState, useEffect } from "react"
import { useDebounceValue, useDebounceCallback } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { singUpSchema } from "@/schemas/signUpSchema.forZod"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"


const Page = () => {
    const [username, setUsername] = useState('') //Stores the value of the username input field.
    const [usernameMessage, setUsernameMessage] = useState('') //Stores the message related to the username (e.g., "Username is available" or "Username is taken").
    const [ischeckingusername, setisCheckingUsername] = useState(false) //loader -  A boolean that indicates if the system is currently checking the username's uniqueness.
    const [issubmitting, setisSubmitting] = useState(false) //is form submitted - A boolean that indicates if the form is currently being submitted.

    //A debounced version of the username state. It will only update 300 milliseconds after the user stops typing, reducing the number of API requests sent to the server.
    const debounced = useDebounceCallback(setUsername, 300) //this will make our work easy as it will fire request to databse on its own after 300millisec
    const { toast } = useToast()
    const router = useRouter() //allows for navigation between pages.

    //infer means interface
    const form = useForm<z.infer<typeof singUpSchema>>({ //<z.infer<typeof singUpSchema>> this is written becuase of typescript error handling feature because of this it will become conform that zod will follow singUpSchema
        resolver: zodResolver(singUpSchema),
        defaultValues: {
            username: '', //clean up form once submitted
            email: '',//clean up form once submitted
            password: '' //clean up form once submitted
        }
    })

    //request that will go to backend for debouncing to work
    //This hook triggers the checkUsernameUnique function whenever debouncedUsername changes (i.e., when the user types a username).
    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (username) { //Sets ischeckingusername to true before making the request and back to false once the request completes.
                setisCheckingUsername(true) //loding is started
                setUsernameMessage('') //if previously any error or successful message is recived clear that
            }
            try {
                // console.log("hello")
                const response = await axios.get(`/api/check-username-unique?username=${username}`) //hit this url with debouncedUsername that the user is writing now
                setUsernameMessage(response.data.message) //If the request is successful, the response message is stored in usernameMessage.
            } catch (error) { //If there’s an error, it handles the error and sets the appropriate message.
                const axiosError = error as AxiosError<ApiResponse> //if error is related to server error will be stored in axiosError
                setUsernameMessage( //update setUsernameMessage with the error
                    axiosError.response?.data.message ?? "Error checking username"
                )
            } finally {
                setisCheckingUsername(false) //make setisCheckingUsername back to false as process is completed , loading is stopped
            }
        }
        checkUsernameUnique()
    }, [username])


    const onSubmit = async (data: z.infer<typeof singUpSchema>) => { //onsubmit will pass through handlesubmit
        setisSubmitting(true) //since we are submittng
        try {
            const response = await axios.post<ApiResponse>(`/api/sign-up`, data) //hit the signup page and get data
            toast({
                title: 'Success',
                description: response.data.message

            })
            router.replace(`/verify/${username}`) //send user to verify page once signed up
            setisSubmitting(false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse> //if error is related to server error will be stored in axiosError
            let errorMessage = axiosError.response?.data.message
            toast({
                title: "Signup failed",
                description: errorMessage,
                variant: "destructive"
            })
            setisSubmitting(false)
        }
    }

    return (

        <div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                    <div className="text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                            Join Mystery Message
                        </h1>
                        <p className="mb-4">
                            Sign up to start your anonymous adventure
                        </p>
                    </div>
                    <div>
                        {/* //taken directly from shadcn form templete */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                <FormField
                                    name="username"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                {/* here onchange is required so that username goes properly  */}
                                                <Input placeholder="username" {...field} onChange={(e) => { field.onChange(e), debounced(e.target.value) }} />

                                            </FormControl>
                                            {ischeckingusername && <Loader2 className="animate-spin" />}
                                            <p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                                                {username ? usernameMessage.split(',').map((msg, index) => (<span key={index} className="flex justify-center p-1"> {msg}</span>)) : ''}
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="email"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                {/* email will automatically go as form is submitted */}
                                                <Input placeholder="email" {...field} />
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
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                                                </>
                                            ) : ('Signup')
                                        }
                                    </Button>
                                </div>
                            </form>
                        </Form>
                        <div className="text-center mt-4">
                            <p>
                                Already a member?{' '}
                                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                                    Sign in
                                </Link>
                            </p>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}
export default Page