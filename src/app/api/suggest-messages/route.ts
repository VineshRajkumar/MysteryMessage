//NOTE - CHATGPT API KEY REQUIRES MONEY TO GENERATE 
//i am using groq ai since it is free right now 

import OpenAI from 'openai';

import { createOpenAI,openai } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';
export const maxDuration = 30;

const groq = createOpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});


export async function POST(req: Request) {
  try {
    
    // const {prompt} = await req.json();
    const prompt = "Generate a list of three creative and open-ended questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, such as Qooh.me, and should appeal to a broad audience. Avoid personal or sensitive topics. Focus on universal themes that inspire curiosity and friendly interaction, but feel free to vary the topics, tone, and style. Each time, imagine you're catering to a different audience or setting, like a casual chat, a deep conversation, or a fun and light-hearted exchange. Ensure the output is always fresh, engaging, and conducive to a positive conversational environment.Just give the questions no other text other than that."



    
    const result = await streamText({
      model: groq('llama3-8b-8192'), //using llama3 model
      // maxTokens:700,
      prompt,
      temperature: 0.7
    });
    // console.log(result)
    // console.log(result.toDataStreamResponse())
    return result.toDataStreamResponse();

  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const {name,status,headers,message} = error
      return NextResponse.json({
        name,status,headers,message
      },{status})   
    }
    else{
      console.log("An unexprected error occured",error)
      throw error
    }
  }
}
