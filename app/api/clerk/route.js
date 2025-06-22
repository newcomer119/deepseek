import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) { 
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headerPayload = await headers()
    const svixHeaders = {
        "svix-id" : headerPayload.get("svix-id"),
        "svix-timestamp" : headerPayload.get("svix-timestamp"),
        "svix-signature" : headerPayload.get("svix-signature"),
    }


    // Get Payload and Verify it 
    const payload = await req.json()
    const body = JSON.stringify(payload);
    const{data,type} = wh.verify(body, svixHeaders);


    // Prepare the user data to be saved in the database 
    const userData={
        _id:data.id,
        email:data.email_addresses[0].email_addresses,
        name: `${data.first_name} ${data.last_name}`.trim(),
        image : data.image_url,
    };

    await connectDB();

    switch(type) {
        case 'user.created':
            // Create a new user in the database
            await User.create(userData);
            break;
        case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData)
            break;
        case 'user.deleted':
            await User.findByIdAndDelete(data.id);
            break;
        default:
            break;
    }
    return NextResponse.json({message : "Event Received"}, {status: 200});
}