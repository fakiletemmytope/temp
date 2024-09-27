import bcrypt from "bcrypt"

const salt = 10

export const hashed_password = async(password) =>{
    return bcrypt.hashSync(password, 10);
}


export const verify_password = async(password, hashedPassword) =>{
    return bcrypt.compareSync(password, hashedPassword);
}