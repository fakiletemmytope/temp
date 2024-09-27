import express from "express"
import dotenv from 'dotenv'
import { UserRouter } from "./routes/user_routes.js"
import { CauseRouter } from "./routes/cause_routes.js";
import bodyParser from 'body-parser';
import { DonationRouter } from "./routes/donation_routes.js";
// import session from "express-session";


const app = express()
const PORT = 3001
dotenv.config()

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// app.use(session({
//     secret: process.env.SECRET_KEY,
//     resave: false,
//     saveUninitialized: false
// }));


//routes
app.use('/users', UserRouter)
app.use("/causes", CauseRouter)
app.use("/donations", DonationRouter)
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})


