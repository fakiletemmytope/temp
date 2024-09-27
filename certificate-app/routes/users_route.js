import { Router } from "express";
import UserModel from "../schemas/user_schema.js";
import connectDb from "../utils/db_connect.js";
import { verify_password, hashed_password } from "../utils/password.js";
import { generate_token } from "../utils/token.js";
import { authUser } from "../middlewares/auth_user";


const UserRouter  = Router()

//get all users
UserRouter.get("/", authUser, async(request, response) =>{
    console.log(request.user_data)
    try{
        await connectDb()
        const users = await UserModel.find()
        if(users){
            return response.status(200).json(users)
        }
        else{
            return response.status(200).send("No users")
        }
    }catch(error){
        return response.status(403).send(`${error}`)
    }
})

//get one user
UserRouter.get("/:user_id", authUser, async(request, response) =>{
    const id = request.params.user_id
    if(id){
        try{
            await connectDb()
            const user = await UserModel.findById()
            if(user){
                return response.status(200).json(user)
            }
            else{
                return response.status(404).send("User does not exist")
            }

        }catch(error){
            return response.status(403).send(`${error}`)
        }
    }
    else{
        return response.status(403).send(`No user_id`)
    } 
    
})

//create user
UserRouter.post("/", async(request, response) =>{
    const { first_name, last_name, password, email } =  request.body
    try{
        await connectDb()
        const checkuser = await UserModel.findOne({email: email})
        if(checkuser.email == email){
            return response.status(403).send("User already exit")
        }
        const hashedPassword = await hashed_password(password)
        const new_user = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: hashedPassword
        }
        const user = new UserModel(new_user)
        await user.save()
        return response.status(201).send("User created")
    }
    catch(error){
        return response.status(403).send(`${error}`)
    }   
    
})

//update user
UserRouter.put("/:user_id", async(request, response) =>{
    const id = request.params.user_id
    const { first_name, last_name } = request.body
    if(id){
        try{
            await connectDb()
            const user = await UserModel.findById()
            if(user){
                first_name? user.first_name = first_name: null
                last_name? user.last_name = last_name: null
                await user.save()
                return response.status(200).send("User updated")
            }
            else{
                return response.status(404).send("User does not exist")
            }

        }
        catch(error){
            return response.status(403).send(`${error}`)
        }
    }
    else{
        return response.status(403).send(`No user id`)
    }   
})

//delete user
UserRouter.get("/user_id", authUser, async(request, response) =>{
    const id = request.params.user_id
    if(id){
        try{
            await UserModel.findByIdAndDelete(id)
            return response.status(210).send("User deleted")
        }
        catch(error){
            return response.status(403).send(`${error}`)
        }
    }
    else{
        return response.status(403).send(`No user id`)
    }
})

UserRouter.post("/access-token", async(request, response)=>{
    const{ email, password } = request.body
    try{
        await connectDb()
        const user = await UserModel.find({email: email})
        console.log(user[0])
        if(user){
            const verify = await verify_password(password, user[0].password)
            if(verify){
                const token = await generate_token(user[0])
                return response.status(200).json({
                    "access-token": token
                })
            }
            else{
                return response.status(403).send("Incorrect email or password")
            }
        }
        else{
            return response.status(403).send("User does not exist")
        }
    }
    catch(error){
        return response.status(401).send(`${error}`)
    }
})


export default UserRouter