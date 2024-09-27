import dotenv from 'dotenv'
import jwt from "jsonwebtoken"


dotenv.config()

//for generating token
export const generate_token = async (user) =>{
    //console.log("about generating token")
    const jwtSecretKey = process.env.SECRET_KEY;
    const payload = {
      user: {
          user_id: user.id,
          user_email: user.email,
          username: user.username
      }
    }
    const options = { expiresIn: '30m' };
    return jwt.sign(payload, jwtSecretKey, options);
}


//for verify token and sending payload content
export const verify_token = async (token) => {
    const secret = process.env.SECRET_KEY;
  
    try {
      const decoded = jwt.verify(token, secret);
      return { success: true, data: decoded };
    } catch (error) {
      return { success: false, error: error.message };
    }
}

