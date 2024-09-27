import mongoose from "mongoose"



const Schema = mongoose.Schema;

var userModelSchema = new Schema({
    first_name: {type: String, unique: false, required: true},
    last_name: {type: String, unique: false, required: true},
    email: {type: String, unique: true, required: true},
    password: {type:String, unique:false, required: true}
    
});

// Compile model from schema
const UserModel = mongoose.model('Users', userModelSchema );

export default UserModel