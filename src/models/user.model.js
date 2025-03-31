import mongoose , {Schema} from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String,// cloudinary url
            required: true,
        },
        coverImage: {
            type: String,// cloudinary url
            required: true,
        },
        watchHistory: [
             {
                type: Schema.Types.ObjectId,
                ref: "Video"
             }
        ],
        password: {
            type: String,
            required: [true ,"Password is required"]
        },
        refreshToken:{
            type: String

        }
    },
    {
        timestamps: true
    }
)
userSchema.pre("save", async function (next){
    if(!this.isModified("password")) return next();// if password is modified then change the save the password in new form 
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}// making default method for checking or comparing password 

userSchema.methods.generateAccessToken = function(){
   return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username ,
            fullName: this.fullName
        }
        // format - add payload , Token key 
        ,
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        } 
    )
}

userSchema.methods.generateRefreshToken = function(){
   return jwt.sign(
        { 
            _id: this._id,// it takes only some id and specific value 
        
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User =  mongoose.model("User",userSchema)