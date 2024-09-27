import UserModel from "../schemas/users_schema.js"
import { verify_passwd } from "../utils/password.js"
import connectDb from "../utils/connect.js"


const userLogin = async (request, response, next) =>{    
    console.log("mi")
    const {email, password} = request.body    

    if(!email || !password){        
        return response.status(400).json({ message: 'password and email are required' })
    }
    else{
        try {

            connectDb()
            const user = await UserModel.findOne({'email': email})
            
            if(user){
                    //verify user password
                    const check_password = verify_passwd(password, user.password)
                    if(check_password){
                        //add user details to the request object
                        request.userId = user._id  
                        request.username = `${user.first_name} ${user.last_name}`
                        request.email = user.email
                        next()
                    }else{
                        return response.status(400).json({ message: "User's email or/and password wrong" })
                    }
                
            }
            else{
                
                return response.status(400).json({ message: 'User does not exist' })
            }
        } 
        catch (error) {
            response.status(500).json({
                "error": error
            });
        }

    }
    
    
    
}

export default userLogin