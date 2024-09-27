import bcrypt from 'bcrypt'
const saltRounds = 10;


export const hash_passwd = async (passwd) =>{
    return bcrypt.hash(passwd, saltRounds)
}

export const verify_passwd = async (passwd, hash) =>{
    return bcrypt.compare(passwd, hash)
}