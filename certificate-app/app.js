import express from "express"
import dotenv from 'dotenv'
import bodyParser from 'body-parser';
import UserRouter from "./routes/users_route.js";
import CertRouter from "./routes/certificate_route.js";



const app = express()
const PORT = 3000
dotenv.config()

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//routes
app.use('/users', UserRouter)
app.use('/cert', CertRouter)
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})