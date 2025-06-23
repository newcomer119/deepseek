export const maxDuration =60
import OpenAI from "openai";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";    
import Chat from "@/models/Chat";



const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(request) {
    try{
        const{userId} = getAuth(request);
        const{chatId,prompt}= await request.json();

        if(!userId){
            return NextResponse.json({success:false,error:"Unauthorized"})
        }

        await connectDB();
        // find chat document in the database based on the userId and chatId
        const data = await Chat.findOne({userId,_id: chatId});

        if (!data) {
            return NextResponse.json({success: false, error: "Chat not found"});
        }

        // create a user prompt
        const userPrompt = {
            role : "user",
            content : prompt,
            timestamp : Date.now()
        };

        data.messages.push(userPrompt);

        // call the deepseek API to get the response
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content:prompt }],
            model: "deepseek-chat",
            store : true,
          });

        const message = completion.choices[0].message;
        message.timestamp = Date.now();
        data.messages.push(message);
        data.save();

        return NextResponse.json({success:true, data:message})

    }catch(error){
        return NextResponse.json({success : false, error : error.message});
    }
}