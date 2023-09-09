import mongoose from "mongoose";

const TokenSchema = mongoose.Schema({
    token:{
        type: String,
        required: true
    }
})
//now 'token' is a key in tokenSchema with value as a string passed
const token = mongoose.model('token', TokenSchema)
export default  token;
//for jwt auth run node=> require('crypto).randomBytes(64).toString('hex')