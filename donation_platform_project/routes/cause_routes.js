import express, { request, response } from "express"
import CauseModel from "../schemas/cause_schema.js"
import authUser from "../middlewares/authUser.js"
import connectDb from "../utils/connect.js"
export const CauseRouter = express.Router()

//create a cause
CauseRouter.post('/', authUser, async (request, response) =>{
    const { title, description, required_amount } = request.body
    const cause = {
        title: title,
        description: description,
        required_amount: required_amount,
        amount_raised: 0,
        organizer_id: request["user"]["user_id"],
        organizer: request["user"]["username"],
        status: true
    }

    try{
        await connectDb()
        const new_cause = new CauseModel(cause)
        await new_cause.save()
        response.status(201).json({
            "message":"cause created"
        })

    }
    catch(error){
        //console.log(error)
        response.status(401).json({
            "message": error.message
        })
    }
})

//get all causes
CauseRouter.get('/', authUser, async(request, response) =>{
    try{
        await connectDb()
        const causes = await CauseModel.find()
        if(causes.length > 0){
            
            const all_causes = []
            causes.map((cause) =>{
                const {_id, title, description, required_amount, amount_raised, organizer} = cause
                const cause_detail = {
                    id: _id,
                    title: title,
                    description: description,
                    required_amount: required_amount,
                    amount_raised: amount_raised,
                    organizer: organizer
                }
                all_causes.push(cause_detail)
            })
            
            return response.status(200).json(all_causes)
        }
        else{
            return response.status(200).json({
                'causes': "No causes"
            }) 
        }
    }
    catch(error){
        return response.status(401).json({
            'message': `the error is: ${error}`
        })
    }
})

CauseRouter.get('/:id', authUser, async(request, response) =>{
    const id = request.params.id
    try{
        await connectDb()
        const cause = await CauseModel.findById(id)
        //console.log(cause)
        if(cause){
            const { _id, title, description, required_amount, amount_raised, organizer } = cause
            const cause_details = {
                id: _id,
                title: title,
                description: description,
                required_amount: required_amount,
                amount_raised: amount_raised,
                organizer: organizer
            }
            return response.status(200).json({
                'causes': cause_details
            })
        }
        else{
            return response.status(200).json({
                'causes': "No causes"
            }) 
        }
    }
    catch(error){
        return response.status(401).json({
            'message': error
        })
    }
})

CauseRouter.put('/:id', authUser, async(request, response)=>{
    const{ description } = request.body
    //console.log(description)
    
    try{
        await connectDb()
        const cause = await CauseModel.findById(request.params.id)
        //console.log(cause)
        if(cause && cause.organizer_id == request['user']['user_id']){
            description? cause.description = description:  null
            await cause.save()
            response.status(200).json({
                'message': "details updated"
            })
        }
        else{
            return response.status(401).json({
                'message': 'unauthorized user'
            })
        }
    }
    catch(error){
        return response.status(401).json({
            'message': error.message
        })
    }
    
})

CauseRouter.delete('/:id', authUser, async (request, response)=>{
            
    try{
        await connectDb()
        const cause = await CauseModel.findById(request.params.id)
        
        if(cause && cause.organizer_id == request['user']['user_id']){
            await CauseModel.findByIdAndDelete(request.params.id)
            response.status(210).json({
                'message': "cause deleted"
            })
        }
        else{
            return response.status(401).json({
                'message': 'Cause does not exist'
            })
        }
    }
    catch(error){
        return response.status(401).json({
            'message': error.message
        })
    }
})