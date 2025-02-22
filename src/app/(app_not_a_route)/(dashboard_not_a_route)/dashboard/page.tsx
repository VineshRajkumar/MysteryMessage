//NOTE :- CONSOLE.LOGS IN FRONTEND ARE ONLY VISIBLE IN WEBSITE CONSOLE OR BROWSER CONSOLE THEY ARE NOT VISIBLE IN CMD VS CODE CONSOLE. 
//SO IF YOU DID ANY CONSOLE.LOG IN FRONTEND CHECK BROWSER CONSOLE

'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { Message } from '@/model/user.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema.forZod'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import mongoose from 'mongoose'
import { User } from 'next-auth'

import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { Skeleton } from "@/components/ui/skeleton"
const Page = () => {
  const [messages, setmessages] = useState<Message[]>([]) //Initializes messages state as an empty array of Message objects.
  const [isLoading, setIsLoading] = useState(false) //Loader - Initializes isLoading state as false. This might be used to show a loading spinner or disable certain UI elements while data is being fetched.
  const [isSwitchLoading, setIsSwitchLoading] = useState(false) //Toggle Switch - Initializes isSwitchLoading as false. This is likely used to indicate if a toggle switch or similar element is loading.
  const { toast } = useToast()
  const router = useRouter();

  const handleDeleteMessage = (messageId: string) => { //A function that deletes a message from the messages state.
    setmessages(messages.filter((message) => message._id !== messageId)) //remove that message which is equal to messageId
  }

  const { data: session, status } = useSession() //Fetches session data using useSession from next-auth/react. This might include user information if the user is logged in.


  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)//Initializes a form with react-hook-form, using zodResolver to validate the form data against acceptMessageSchema.
  })



  const { register, watch, setValue } = form; //extract reegister watch and setvalue from form
  // register: Registers input fields for validation from zod
  // watch: Watches and returns the value of specific form fields.
  // setValue: Sets the value of a specific field.

  const acceptMessages = watch('acceptMessages') //Watches the acceptMessage field in the form, allowing you to track its current value.

  //When Toggle Switch is clicked setvalue is changed and then these operations will be performed
  // A memoized function is a function that remembers the results of its previous computations based on its inputs. This can improve performance, especially for expensive or repetitive calculations.
  const fetchAcceptMessage = useCallback(async () => { //useCallback memoizes the function to avoid re-creating it on every render unless setValue changes.
    setIsSwitchLoading(true) //Toggle switch - Sets the isSwitchLoading state to true to indicate that data fetching is in progress.

    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages') //Makes an HTTP GET request to the /api/accept-messages endpoint, expecting a response of type ApiResponse.
      console.log("response of fetchAcceptMessage- ", response.data.isAcceptingMessage)
      setValue('acceptMessages', response.data.isAcceptingMessage) //Frontend will get updated first to show the message then only it goes to backend. Updates the acceptMessage form field with the data received from the server.

    }
    catch (error) {
      const axiosError = error as AxiosError<ApiResponse> //if error is related to server error will be stored in axiosError
      let errorMessage = axiosError.response?.data.message
      // console.log("error is",errorMessage)
      toast({
        title: "Error",
        description: errorMessage || "Failed to fetch message settings",
        variant: "destructive"
      })

    } finally {
      setIsSwitchLoading(false) //Toggle switch - Ensures that isSwitchLoading is set back to false once the operation is complete.
    }
  }, [setValue, toast])


  //while Loader is Spinninng these operations will be performed 

  //The refresh value is only true during the execution of that particular function call. 
  //A memoized function is a function that remembers the results of its previous computations based on its inputs. This can improve performance, especially for expensive or repetitive calculations.
  const fetchMessages = useCallback(async (refresh: boolean = false) => { //A memoized function to fetch messages if setIsLoading or setmessages changes. useCallback prevents unnecessary re-renders. 
    setIsLoading(true) //Starts the loading state for messages and stops loading for the toggle-switch.
    setIsSwitchLoading(false)
    try {
      console.log("Making API request to /api/get-messages");
      const response = await axios.get<ApiResponse>('/api/get-messages') //Makes an HTTP GET request to /api/get-messages to retrieve the messages
      // console.log("messages incoming - ",response.data.message)
      if (Array.isArray(response.data.message)) { //this is added because of typescript , here we tell typescript to only allow it if it comes in the form of array
        setmessages(response.data.message || []) //Updates the messages state with the retrieved messages. If no messages are returned, it sets an empty array.
      }


      // console.log(messages)
      if (refresh) { //If the refresh argument is true, it shows a toast notification indicating that the messages have been refreshed.
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages"

        })

      }

    } catch (error) {
      console.error("Error fetching messages:", error);
      const axiosError = error as AxiosError<ApiResponse> //if error is related to server error will be stored in axiosError
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Error",
        description: errorMessage || "Failed to fetch message settings Loader Issue",
        variant: "destructive"
      })
    } finally {//Ensures that both loading states are set to false after the operation completes.
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setIsLoading, setmessages, toast])

  // useEffect is used to perform side effects in a functional component. it doesnot remeber the previous computation. 
  //useeffect will run in background
  useEffect(() => {
    // if (status === 'loading') return; 
    if (!session || !session.user) return //if not logged in then donot allow just return 
    // console.log("Making API request to /api/get-messages");
    fetchMessages()

    fetchAcceptMessage()
  }, [session, setValue, fetchMessages, fetchAcceptMessage])









  //Toggle Switch will be used here to change the setvalue so that it will trigger the const fetchAcceptMessage = useCallback function
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        //if watch('acceptMessages') is being watched then make it false that means stop watching and if it is not watching then start watching
        acceptMessages: !acceptMessages //This toggles the current state of acceptMessages (if it’s true, it will be set to false, and vice versa).

      })
      console.log("response of handleSwitchChange- ", response.data.isAcceptingMessage)
      setValue('acceptMessages', !acceptMessages)
      toast({
        title: response.data.message,
        variant: "default"
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse> //if error is related to server error will be stored in axiosError
      let errorMessage = axiosError.response?.data.message
      // console.log("error from handle is",errorMessage)
      toast({
        title: "Error",
        description: errorMessage || "Failed to fetch message",
        variant: "destructive"
      })
    }
  }


  //URL CREATION FOR USER:-
  const [profileUrl, setProfileUrl] = useState<string | null>(null);

  const username = session?.user?.username; // get username from session

  //window.location.protocol returns the protocol part of the URL (e.g., http: or https:).
  //window.location.host  returns the host part of the URL (e.g., example.com or localhost:3000).
  //const baseUrl creates a base URL by combining the protocol and host. For example, if the current URL is https://example.com, baseUrl will be https://example.com.

  // creates a profile URL using the base URL and the username, eg:- https://example.com/u/john_doe.
  
  useEffect(() => {
    if (typeof window !== "undefined" && session?.user?.username) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      setProfileUrl(`${baseUrl}/u/${session.user.username}`);
    }
  }, [session]);

  //COPY TO Clipboard FOR USER
  const copyToClipboard = () => {
    // Clipboard API to copy text to the clipboard
    //youwont get navigator in server componet you get it only in client componet
    if (profileUrl) {
      navigator.clipboard.writeText(profileUrl)
      toast({
        title: "URL Copied",
        description: "Profile URL has been copied to clipboard"
      })
    } else {
      toast({
        title: "Error",
        description: "Profile URL is not available"
      })
    }
  }



  if (!session || !session.user) { //if still unautherencated user is doing this the stop the process
    return <div>Please Login</div>
  }




  return (
    <div >
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl ?? ""}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>

        <div className="mb-4">
          <Switch
            // SINCE WE HAVE TO USE REGISTER AND AS WE DONOT HAVE FORM HERE SO { ...field(name) }  this is replaced by  {...register('acceptMessages')}
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>

        <Separator />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            <>
              <div className="flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-sm">
                <Skeleton className="h-[125px] w-full rounded-lg bg-gray-200" />
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-2/3 bg-gray-200" />
                </div>
              </div>

              {/* Skeleton for Card 2 */}
              <div className="flex flex-col space-y-3 bg-white p-4 rounded-lg shadow-sm">
                <Skeleton className="h-[125px] w-full rounded-lg bg-gray-200" />
                <div className="space-y-2 mt-4">
                  <Skeleton className="h-4 w-3/4 bg-gray-200" />
                  <Skeleton className="h-4 w-1/2 bg-gray-200" />
                  <Skeleton className="h-4 w-full bg-gray-200" />
                  <Skeleton className="h-4 w-2/3 bg-gray-200" />
                </div>
              </div>
            </>
          ) : (messages.length > 0 ? (

            messages.map((item, index) => (

              <MessageCard

                key={item._id as string} //this is a typescript issue so thats why item._id as string  is written
                message={item}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          ))}


        </div>
      </div>
    </div >
  )
}

export default Page
