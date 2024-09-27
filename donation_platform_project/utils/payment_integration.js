// import Paystack from '@paystack/inline-js';
import https from "https"
import dotenv from 'dotenv'
import axios from "axios"

dotenv.config()

const SECRET_KEY = process.env.PAYSTACK_SECRET_KEY 

const URL = "https://api.paystack.co/transaction/"
const payment = async(email, amount, reference) =>{
    const params = JSON.stringify({
                "email": email,
                "amount": amount,
                "reference": reference
        })
    try{
        const response = await axios({
            method: 'post',
            url: `${URL}initialize`,
            data: params,
            headers:{
                Authorization: `Bearer ${SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        })
        return response
    }
    catch(error){
        return "network error"
    }

}

//initialze transaction(donation)
export const generatePayment = async(email, amount, reference) =>{

    return await payment(email, amount, reference)

}


//verify transaction(donation)
export const verifyPayment = async(reference) =>{

    try{
        const response = await axios({
        method: 'get',
        url: `${URL}verify/${reference}`,
        headers:{
            Authorization: `Bearer ${SECRET_KEY}`,
            'Content-Type': 'application/json'
        }
    })
        return response
    }
    catch(error){
        console.log(`${error}`)
        return "network error"
    }
}