import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res)=>{
    // get user detail from frontend 
    // validation will be use - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // uplaod them to cloudnary avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res
    

    const {fullName, email, username, password} = req.body;
    console.log("email: ", email);
    if([email,  password, username,fullName].some((field)=>
        field?.trim === "")// this for getting al the field from every email,  password, username,fullName agar nahi hn toh error thorw kar degga 
    ){
        throw new ApiError(400, "All field are required")
    }

   const existedUser = await User.findOne(
        {
            $or: [{username},{email}]
        }
    )
    console.log("username :",username ,"email", email);
    
    if(existedUser){
        throw new ApiError(409, "User with email already exists")
    }
     
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar files is required")
    }
    const avatar= await uploadOnCloudinary(avatarLocalPath)
    const coverImage  = await uploadOnCloudinary(coverImageLocalPath)
 
    if (!avatar) {
        throw new ApiError(400,"avatar is required ")
    }

   const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        passsword:password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering the user ")
    }
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Sucessfully")
    )

}) 
export {registerUser}