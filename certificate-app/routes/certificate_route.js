import { Router } from "express";
import UserModel from "../schemas/user_schema.js";
import connectDb from "../utils/db_connect.js";
import { authUser } from "../middlewares/auth_user";
import createCertificate from "../utils/generate-cert.js";


const CertRouter = Router()


CertRouter.get("/generate-cert", authUser, async (request, response) =>{
    const { user_id, user_email, username }  = request.user_data
    console.log(username)
    try{
            //verify user
            await connectDb()
            const checkuser = await UserModel.findOne({email: user_email})
            if(checkuser){
                //generate certifcate 
                const date = new Date().toLocaleDateString();
                const courseTitle = 'Introduction to Node.js';
                await createCertificate(username, courseTitle, date)
                //and send to email
                return response.status(200).send("Certificate  sent to email")
            }
            else{
                return response.status(403).send("1Unauthorised user")
            }
       
    }
    catch(error){
        return response.status(403).send(`${error}`)
    }
    
})



export default CertRouter




