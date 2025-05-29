// lib/db.ts
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable")
}
// @ts-expect-error not set in global types
let cached = global.mongoose

if (!cached) {
    // @ts-expect-error not set in global types
    cached = global.mongoose = { conn: null, promise: null }
}

export async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            dbName: "job",
        }).then((mongoose) => {

            return mongoose
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}


