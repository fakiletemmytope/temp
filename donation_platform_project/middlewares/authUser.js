import { verify_token } from "../utils/token.js";

const authUser = async (request, response, next) =>{
    const token = request.header('Authorization')?.replace('Bearer ', '');
    //console.log(token)
    if(!token){
        return response.status(401).json({
            "details": "No authorization token"
        })
    }
    try{
        //console.log("wetin")
        const verified_token = await verify_token(token)
        //console.log(verified_token)
        if(verified_token.success){
            request.user = verified_token.data.user
            next()
        }
        else{
            return response.status(401).json({
                "details": "User not authenticated",
                "message": verified_token.success
            })
        }
    }
    catch(error){
        return response.status(401).json({
            "details": error
        })
    }
}

export default authUser