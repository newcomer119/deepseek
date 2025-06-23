import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server"; 
import { NextResponse } from "next/server";

export async function POST(request) {
    try{

        const { userId } = getAuth(request);
        const{chatId} = await request.json()

        if(!userId) {
            return NextResponse.json({
                success : false,
                message : "user was not authenticated "
            });
        }


        await connectDB()
        await Chat.deleteOne({_id : chatId, userId});

        return NextResponse.json({success:true, message : "Chat Deleted Successfully"})



    }catch(error){
        return NextResponse.json({success : false, error : error.message})
    }
}