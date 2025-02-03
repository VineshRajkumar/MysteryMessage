'use client'
import { useToast } from '@/components/ui/use-toast'
import { messageSchema } from '@/schemas/messageSchema.forZod'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import mygpt from "@/mygpt.json"
import Link from "next/link"

import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation'
import { useChat } from "ai/react";
import { useCompletion } from 'ai/react';

const specialChar = '||'
const parseStringMessages = (messageString: string):string[]=>{ //this fucntion will split the string at ||
  return messageString.split(specialChar) //give messages in string format
}
const initialMessageString = "What is the most challenging thing you've ever done? || What is the most inspiring quote you've ever heard? || What was the last TV show you binge-watched?"



const Page = () => {

  const router = useRouter()
  const [issubmitting, setisSubmitting] = useState(false)
  const params = useParams<{ username: string }>()//capture username using params  <{username:string}> <-- this is written because of typescript
  const { toast } = useToast()
  
  const form = useForm<z.infer<typeof messageSchema>>({ //<z.infer<typeof signInSchema>> this is written becuase of typescript error handling feature because of this it will become conform that zod will follow signInSchema
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',//clean up form once submitted
    }
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setisSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>(`/api/send-message`,
        {
          username: params.username,
          content: data.content
        }
      )
      toast({
        title: 'Success',
        description: response.data.message
      })

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Message Not Sent",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setisSubmitting(false)
    }
  }

  const handleclickmovetosignup = async () => {
    router.push('/sign-up')
  }

  //Using Groq AI 
  const { completion,complete,isLoading:isSuggestLoading,error } = useCompletion({  //completion stores current result and complete tell the ai to send new prompt
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString                      //Initial completion result. Useful to load an existing history.
  });

  const handleMessageClick = (message:string)=>{
    form.setValue('content',message); //sets value of content when any of three ai prompts are clicked
  }
  const fetchSuggestMessages = async()=>{
    try {
      complete('') //send new prompt
    } catch (error) {
      console.error('Error fetching messages: ',error)
    }
  }
  
  

  //Using JSON file and getting the questions from it :- two methods  
  //(1)
  //const [ranindexone, setRanindexone] = useState<number | null>(null);
  //const [ranindextwo, setRanindextwo] = useState<number | null>(null);
  //const [ranindexthree, setRanindexthree] = useState<number | null>(null);
  // const handlesuggestmessages = async () => {
  //   if (mygpt.length > 0) {
  //     setRanindexone(randomindex(mygpt.length))
  //     setRanindextwo(randomindex(mygpt.length))
  //     setRanindexthree(randomindex(mygpt.length))
  //   }
  // }
  // const randomindex = (length: number) => {
  //   return Math.floor(Math.random() * length)
  // }

  // const handleboxclickone = async () => {
  //   if (ranindexone !== null) {
  //     const selectedquestion = mygpt[ranindexone].question
  //     form.setValue('content', selectedquestion);
  //   }

  // }
  // const handleboxclicktwo = async () => {
  //   if (ranindextwo !== null) {
  //     const selectedquestion = mygpt[ranindextwo].question
  //     form.setValue('content', selectedquestion);
  //   }

  // }
  // const handleboxclickthree = async () => {
  //   if (ranindexthree !== null) {
  //     const selectedquestion = mygpt[ranindexthree].question
  //     form.setValue('content', selectedquestion);
  //   }

  // }

 
//(2)
  //much better version of code by Fisher-Yates algorithm ask gpt to explain this code if needed this code has TC OF O(N) but my code has TC of O(1) in time my code is better but short code is of gpt
  // const handlesuggestmessages = () => {
  //   const uniqueIndices = getUniqueRandomIndices(mygpt.length, 3);
  //   setIndices(uniqueIndices);
  // };

  // const getUniqueRandomIndices = (length: number, count: number) => {
  //   const indices = Array.from({ length }, (_, i) => i);
  //   for (let i = length - 1; i > 0; i--) {
  //     const j = Math.floor(Math.random() * (i + 1));
  //     [indices[i], indices[j]] = [indices[j], indices[i]];
  //   }
  //   return indices.slice(0, count);
  // };

  // const handleBoxClick = (index: number) => {
  //   if (indices[index] !== undefined) {
  //     const selectedQuestion = mygpt[indices[index]].question;
  //     form.setValue('content', selectedQuestion);
  //   }
  // };

  // <CardContent>
  //                   {indices.map((index, i) => (
  //                     <div
  //                       key={i}
  //                       className="grid w-full items-center gap-4 justify-center border-gray-200 rounded-md p-3 border-[1px] hover:cursor-pointer"
  //                       onClick={() => handleBoxClick(i)}
  //                     >
  //                       <div className="flex flex-col space-y-1.5">
  //                         {mygpt[index] ? mygpt[index].question : 'Click On Suggest Messages to Get Messages'}
  //                       </div>
  //                     </div>
  //                   ))}
  //                 </CardContent>
  return (
    <div>
      <div>
        <div className="flex justify-center items-center m-20 bg-gray-100">
          <div className="w-full max-w-6xl p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                Public Profile Link
              </h1>

            </div>
            <div>
              {/* //taken directly from shadcn form templete */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    name="content"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send Anonymous Message to @{params.username}</FormLabel>
                        <FormControl className='whitespace-pre-wrap'>


                          <Input className='pb-12 pt-6 ' placeholder="Write your anonymous message here" {...field} />

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
                        ) : ('Send')
                      }
                    </Button>
                  </div>
                </form>
              </Form>
              {/* <div className="text-center mt-4">
                            <p>
                                Already a member?{' '}
                                <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                                    Sign in
                                </Link>
                            </p>
                        </div> */}

            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center m-20  bg-gray-100">
          <div className="w-full max-w-6xl p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div >
              <Button type="submit" disabled={isSuggestLoading} onClick={fetchSuggestMessages}>Suggest Messages</Button>
            </div>
            <div className="space-y-8">
              <div>Click on any message below to select it.</div>
              <div>
                <Card className="max-w-6xl mt-7" >
                  <CardHeader>
                    <CardTitle>Messages</CardTitle>

                  </CardHeader>
                  <CardContent>

                    {/* using groq ai */}
                    {error?(
                          <p className='text-red-500'>{error.message}</p>
                        ):(
                          parseStringMessages(completion).map((message,index)=>(
                            <Button key={index} variant='outline' className='mb-2 flex items-center w-full gap-4 justify-center text-base ' onClick={()=>handleMessageClick(message)}> 
                            {message}
                            </Button>
                          ))
                        )}


                        {/* using mygpt.json */}
                    {/* <div className="grid w-full items-center gap-4 justify-center border-gray-200 rounded-md p-3 border-[1px] hover:cursor-pointer " onClick={handleboxclickone}>
                      <div className="flex flex-col space-y-1.5  " >
                        
                        
                        {ranindexone === null && (<div>Click On Suggest Messages to Get Messages</div>)}
                        {ranindexone !== null && mygpt.length > 0 && (<div>{mygpt[ranindexone].question}</div>)}
                      </div>
                    </div> */}

                  </CardContent>

                  {/* using mygpt.json */}
                  {/* <CardContent>

                    <div className="grid w-full items-center gap-4 justify-center border-gray-200 rounded-md p-3 border-[1px] hover:cursor-pointer" onClick={handleboxclicktwo}>
                      <div className="flex flex-col space-y-1.5 ">
                        {ranindextwo === null && (<div>Click On Suggest Messages to Get Messages</div>)}
                        {ranindextwo !== null && mygpt.length > 0 && (<div>{mygpt[ranindextwo].question}</div>)}
                      </div>
                    </div>
                  </CardContent>
                  <CardContent>

                    <div className="grid w-full items-center gap-4 justify-center border-gray-200 rounded-md p-3 border-[1px] hover:cursor-pointer" onClick={handleboxclickthree}>
                      <div className="flex flex-col space-y-1.5 ">
                        {ranindexthree === null && (<div>Click On Suggest Messages to Get Messages</div>)}
                        {ranindexthree !== null && mygpt.length > 0 && (<div>{mygpt[ranindexthree].question}</div>)}
                      </div>
                    </div>
                  </CardContent> */}

                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="flex justify-center items-center m-20 bg-gray-100">
          <div className="w-full max-w-6xl p-8 space-y-5 bg-white rounded-lg shadow-md ">
            <div className='flex justify-center'>Get Your Message Board</div>
            <div className='flex justify-center'>

              <Button type="submit" onClick={handleclickmovetosignup} disabled={issubmitting}>Create Your Account</Button>

            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default Page
