import mongoose , {Schema} from "mongoose"
import bcrypt from "bcrypt"

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

userSchema.method.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}// making default method for checking or comparing password 

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
    {
        _id: this_id,
        email: tis.email,
        username: this.username ,
        fullName: this.FullName
    }
    // format - add payload , Token key  
    )
}

userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        { 
            _id: this_id,// it takes only some id and specific value 
        
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }// format - add payload , Token key  
        )
}




export const User =  mongoose.model("User",userSchema)