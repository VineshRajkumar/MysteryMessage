//NOTE :- CONSOLE.LOGS IN FRONTEND ARE ONLY VISIBLE IN WEBSITE CONSOLE OR BROWSER CONSOLE THEY ARE NOT VISIBLE IN CMD VS CODE CONSOLE. 
//SO IF YOU DID ANY CONSOLE.LOG IN FRONTEND CHECK BROWSER CONSOLE

'use client'
import React, { useEffect } from 'react'
import { MdOutlineEmail } from "react-icons/md";
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

//do npm install embla-carousel-autoplay --save
//and npm install embla-carousel-react --save
//for autoplay to work
import Autoplay from 'embla-carousel-autoplay' //will autoplay carousal
import messages from "@/messages.json"

const Page = () => {

  return (
    <div>
      <main className='flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12'>
        <section className='text-center mb-8 md:mb-12'>
          <h1 className='text-3xl md:text-5xl font-bold'>Dive into the World of Anonymous Conversations</h1>
          <p className='mt-3 md:mt-4 text-base md:text-lg'>Explore Mystery Message - Where your identity remains a secret</p>
        </section>
        {/* /for autoplay to work use emebla caraousal */}
        <Carousel className="w-full max-w-xl bg-pink-500" plugins={[Autoplay({ delay: 2000 })]}>
          <CarouselContent >
            {
              messages.map((item, index) => (

                <CarouselItem key={index}  >
                  <div className="p-1 " >
                    <Card className='h-72 flex justify-center items-center border-black border-[10px]  ' >
                      <CardContent className="flex aspect-square items-center justify-center p-6 ">
                        <div className='flex flex-col gap-y-3'>
                          <div className='text-3xl font-bold'>{item.title}</div>
                          <div className='text-base flex gap-x-3 items-center'><MdOutlineEmail size={30} />{item.content}</div>
                          <div className='text-gray-500'>{item.received}</div>
                        </div>

                      </CardContent>


                    </Card>
                  </div>
                </CarouselItem>
              )
              )
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>
      <footer className="text-gray-600 body-font">
        <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
          
          <p className="text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0 mt-4">© 2024 MystryMessage —
            <a href="/" className="text-gray-600 ml-1" rel="noopener noreferrer" target="_blank">@vinesh</a>
          </p>
          <span className="inline-flex sm:ml-auto sm:mt-0 mt-4 justify-center sm:justify-start">
            <a className="text-gray-500">
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg fill="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
              </svg>
            </a>
            <a className="ml-3 text-gray-500">
              <svg fill="currentColor" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0" className="w-5 h-5" viewBox="0 0 24 24">
                <path stroke="none" d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                <circle cx="4" cy="4" r="2" stroke="none"></circle>
              </svg>
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}

export default Page
