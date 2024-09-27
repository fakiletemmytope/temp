import express, { response } from "express"
import authUser from "../middlewares/authUser.js"
import { uuid } from 'uuidv4';
import { generatePayment, verifyPayment } from "../utils/payment_integration.js"
import connectDb from "../utils/connect.js"
import DonationModel from "../schemas/donation_schema.js"
import CauseModel from "../schemas/cause_schema.js";
import dotenv from 'dotenv'


dotenv.config()
export const DonationRouter = express.Router()

//get all donations
DonationRouter.get('/', authUser, async (request, response)=>{
    try{
        await connectDb()
        const donations = await DonationModel.find()
        if (donations.length > 0){
            return response.status(200).json({
                donations: donations
            })
        }
        else{
            return response.status(201).send("No donations")
        }
    }
    catch(error){
        return response.status(401).send(`${error}`)
    }
})


//get one donation
DonationRouter.get('/:donation_id', authUser, async(request, response)=>{
    //console.log(request.params.donation_id)
    const id = request.params.donation_id
    if(id){
        try{
            await connectDb()
            const donation = await DonationModel.findById(id)
            //console.log(donation)
            if (donation){
                return response.status(200).json({
                    donation
                })
            }
            else{
                return response.status(200).send("Donation not found")
            }
        }
        catch(error){
            return response.status(401).send(`${error}`)
        }
    }
    else{
        return response.status(401).send("No id provided")
    }
    

})

//get donations made by a user
DonationRouter.get('/user/:user_id', authUser, async(request, response)=>{
    const id  = request.params.user_id
    const {user_id, user_email, username} = request['user']
    if(id == user_id ){
        try{
            await connectDb()
            const donations = await DonationModel.find({donor_id: id}).exec()
            //console.log(donations)
            if (donations){
                return response.status(200).json({
                    donations
                })
            }
            else{
                return response.status(20).send("No donations")
            }
        }
        catch(error){
            return response.status(401).send(`${error}`)
        }
    }
    else{
        return response.status(401).send("No id provided/ invalid id")
    }
})

//post donation(make donation){only registered users can make donations}
DonationRouter.post('/:cause_id', authUser, async(request, response)=>{
    const {email, amount} = request.body
    const cause_id = request.params.cause_id
    const {user_id, user_email, username} = request['user']
    if(email ==  user_email){
        await connectDb()
        //check if cause exists
        const cause = await CauseModel.findById(cause_id)

        if(cause && cause.status == true){
            //a method that generated a transaction id
            var reference = uuid()

            //call the paystack payment api that returns the reference and checkout link,
            let pay_gen = await generatePayment(email, `${amount * 100}`, reference)
            //console.log(pay_gen)
    
            if (pay_gen == "network error"){
                response.status(401).send(pay_gen)
            }
            else{

                if(pay_gen.status){
                        //create a donation                        
                        let new_donation = {
                            donor_id: user_id,
                            donor: username,
                            cause_id: cause_id,
                            organizer: cause.organizer,
                            reference: reference,
                            amount: amount,
                            status: "pending"
                        }
                        const donation = new DonationModel(new_donation)
                        await donation.save()
                        const {message, data} = pay_gen.data
                        //console.log(message, data)
                        response.status(201).json({
                            "message": message,
                            "reference": data.reference,
                            "checkout_url": data.authorization_url
                        })
                    }
                    else{
                        response.status(401).json({
                            "message": "Network error"
                        })
                    }
            }  

            
        }
        else{
            response.status(401).json({
                "message": "Cause does not exist or donation on cause has been stopped"
            })
        }
        
    }
    else{
        response.status(401).json({
            "message": "Unauthorized User"
        })
    }
    
})

//manual verification of payment
DonationRouter.get("/donation-reference/:reference", authUser, async(request, response)=>{
    const reference = request.params.reference
    if(reference){
        try{
            await connectDb()
            const donation = await DonationModel.findOne({reference: reference})
            //console.log(donation)
            if(donation.status === "pending"){
                //verify from paystack and update the donation and the cause
                const verify = await verifyPayment(reference)
                console.log(verify)
                if(verify === "Network error"){
                    response.status(401).send("Network error")
                }
                else{
                    try{
                        const{ status, reference, gateway_response, amount } = verify.data.data
                        if(status === "abandoned"){
                            donation.status = status
                            await donation.save()
                            response.status(200).send("payment abandoned")
                        }else if(status == "success"){

                            //update the donation and the cause
                            const cause = await CauseModel.findById(donation.cause_id)
                            cause.amount_raised = cause.amount_raised + amount
                            donation.status = status
                            await cause.save()
                            await donation.save()                           
                            response.status(200).json({
                                message:"payment made successsfully",
                                reference: reference,
                                status: status,
                                gateway_response: gateway_response

                            })

                        }else{
                            donation.status = status
                            await donation.save()
                            response.status(200).send(`${status}`)
                        }
                    }catch(error){
                        response.status(401).send(`${error}`)
                    }
                    
                }
            }
            else if(donation.status === "success"){
                response.status(200).send("payment made successsfully")
            }
            else{
                response.status(200).send(`${donation.status}`)
            }
            
        }
        catch(error){
            response.status(401).send(`${error}`)
        }
    }
    else{
        return response.status(202).send("No reference")
    }

})

