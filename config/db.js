import mongoose, { connect } from 'mongoose';

let cached = global.mongoose || {connection: null, promise: null};

export default async function connectDB() {
    if(cached.connection) return cached.connection
    if(!cached.promise){
        cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose) => 
            mongoose
        )
    }
    try{
        cached.connection = await cached.promise;
    }catch(error){
        console.log("Error Connecting to MongoDB:", error);
    }
    return cached.connection;

}