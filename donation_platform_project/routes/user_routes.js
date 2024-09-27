import express from 'express'
import connectDb from '../utils/connect.js'
import UserModel from '../schemas/users_schema.js'
import { hash_passwd } from '../utils/password.js'
import userLogin from '../middlewares/userLogin.js'
import { generate_token, verify_token } from '../utils/token.js'
import authUser from '../middlewares/authUser.js'

export const UserRouter = express.Router()

//get all users
UserRouter.get('/', authUser, async (request, response)=>{
    console.log(request["user"])
    await connectDb()
    const users = await UserModel.find()
    const users_details = []
    if(users.length >= 1){
        users.map((user)=>{
            const {last_name, first_name, email, _id} = user
            const user_details = {last_name: last_name,
                first_name: first_name,
                email: email, 
                id: _id}
            users_details.push(user_details)

        })
        response.status(200).json(users_details)
    }
    else{
        response.send("no user")
    }        
})

//get a user
UserRouter.get('/:id', authUser, async (request, response) => {
    const id = request.params.id;
    if(id == request["user"]["user_id"])
        try {
            ;
            await connectDb();
            const user = await UserModel.findById(id);       
            if (user) {
                const {last_name, first_name, email, _id} = user
                const user_details = {last_name: last_name,
                    first_name: first_name,
                    email: email, 
                    id: _id}
                response.status(200).json(user_details);
            } else {
                response.status(404).send("User does not exist");
            }
        } catch (error) {
            response.status(500).send(`Error: ${error.message}`);
        }
    else{
        response.status(404).send("Unauthorised User");
    }
});

//add a user
UserRouter.post('/', async (request, response)=>{
    const {first_name, last_name, password, email} = request.body
    try{
        await connectDb()
        const user = await UserModel.findOne({email: email})
        //console.log(user)
        if(!user){
            const hash_password = await hash_passwd(password)
            const user = {
                email: email,
                password:  hash_password,
                first_name: first_name,
                last_name: last_name
            }
            const new_user = new UserModel(user)
            await new_user.save()
            response.status(201).json({
                "message":"user created"
            })
        }
        else{
            response.status(403).send("user already exists")
        }
    } 
    catch (error) {
        response.send(`${error}`)
    }
})


//update a user info
UserRouter.put('/:id', authUser, async (request, response)=>{
    
    if(request.params.id == request["user"]["user_id"])
        try{
            const id = request.params.id
            const {first_name, last_name} = request.body
            await connectDb()
            const user = await UserModel.findById(id);
            first_name? user.first_name = first_name: null
            last_name? user.last_name = last_name: null
            await user.save()
            response.status(201).json({
                "message":"user details updated"
            })

        }
        catch(error){
            console.log(error)
        }  
    else{
        return response.status(403).send("Unauthorized user")
    }
    
})


//delete a user
UserRouter.delete('/:id', authUser, async (request, response)=>{
    if(request.params.id == request["user"]["user_id"])
        try{
            const id = request.params.id
            await connectDb()
            await UserModel.findByIdAndDelete(id)
            response.status(210).send("User deleted")
        }catch(error){
            response.send(`${error}`)
        }
    else{
        return response.status(403).send("Unauthorized user")
    }
})


//get access-token (only registered users)
UserRouter.post('/access-token', userLogin, async (request, response) =>{
    
    //for the JWT token
    const user = {
        id: request.userId,
        email: request.email,
        username: request.username
    }

    const token = await generate_token(user)
    response.status(201).json({
    token: token
    });
})

