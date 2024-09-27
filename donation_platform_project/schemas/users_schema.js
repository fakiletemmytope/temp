import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true },
    first_name: { type: String, required: true, unique: false},
    last_name: { type: String, required: true, unique: false }
});

const UserModel = mongoose.model('users', userSchema)

export default UserModel

