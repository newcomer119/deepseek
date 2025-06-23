import connectDB from "@/config/db";
import Chat from "@/models/Chat";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    try{
        const{userId} = getAuth(request);   

        if(!userId) {
            return NextResponse.json({ success : false , message : "user not authenticated" }, { status: 401 });
        }

        await connectDB();
        const data = await Chat.find({userId});
        return NextResponse.json({ success: true, data }, { status: 200 });                                             

    }catch(error){
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}