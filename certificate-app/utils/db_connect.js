import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const port = process.env.DATABASE_PORT
const database_name = process.env.DATABASE_NAME
const host = process.env.DATABASE_HOST

const url = `mongodb://${username}:${password}@${host}:${port}/${database_name}?authSource=admin`

const connectDb = async () => {
    try {
        //console.log("connecting")
        await mongoose.connect(url);
    } catch (error) {
        console.log(`the error is: ${error}`)
        // process.exit(1)
    }
}

export default connectDb
