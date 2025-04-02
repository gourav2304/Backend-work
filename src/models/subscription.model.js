import  mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema({
     subscriber: {
        type: Schema.Types.ObjectId,// one who subscribing 
        ref: "User"
     },
     channel: {
        type: Schema.Types.ObjectId, //one to whom a 'subscriber' is subscribing
        ref: "user" 
     }
},{timestamps: true })

export const subscription = mongoose.model(Subcription , subscriptionSchema)