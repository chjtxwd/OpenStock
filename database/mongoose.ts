import mongoose from "mongoose";

declare global {
    var mongooseCache: {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
    }
}

let cached = global.mongooseCache;

if (!cached){
    cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
    const MONGODB_URI = process.env.MONGODB_URI;

    if(!MONGODB_URI){
        // Do not throw at module import time. Throw when trying to connect.
        throw new Error("MongoDB URI is missing");
    }

    if(cached.conn) return cached.conn;

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {bufferCommands: false});
    }

    try{
        cached.conn = await cached.promise;
    }
    catch(err){
        cached.promise = null;
        throw err;
    }

    console.log(`MongoDB Connected ${MONGODB_URI} in ${process.env.NODE_ENV}`);
    return cached.conn;
}