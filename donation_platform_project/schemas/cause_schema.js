import mongoose from "mongoose";
const { Schema } = mongoose;

const causeSchema = new Schema({
    organizer: { type: String, required: true },
    organizer_id: { type: String, required: true },
    title: { type: String, required: true, unique: true},
    description: { type: String, required: true },
    required_amount: { type: Number, required: true},
    amount_raised: { type: Number, required: true },
    status: { type: Boolean, required: true }
});

const CauseModel = mongoose.model('causes', causeSchema)

export default CauseModel

