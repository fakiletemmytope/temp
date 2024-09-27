import mongoose from 'mongoose'

const {Schema} = mongoose

const donationSchema = new Schema({
    donor_id: { type: String, required: true},
    donor: { type: String, required: true},
    cause_id: { type: String, required: true },
    organizer: { type: String, required: true, unique: false},
    reference: {type: String, required:true, unque: true},
    amount: {type: Number, required:true},
    status: {type: String, required: true, default: "pending"}
});

const DonationModel = mongoose.model('donations', donationSchema)

export default DonationModel
