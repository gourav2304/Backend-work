import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
 try {
     const token =
       req.cookies?.accessToken ||
       req.header("Authorization")?.replace("Bearer", "");
     if (!token) {
       throw new ApiError(401, "Unauthorised request ");
     }
     const decodedToken = jwt.verify(token, processs_Access_Token_Secret);
   
     const user = await User.findById(decodedToken?._id).select(
       "-password -refreshToken"
     );
   
     if (!user) {
       throw new ApiError(401, "Invalid Acesstoken");
     }
   
     req.user = user;
     next();
 } catch (error) {
    throw new ApiError(401, error?.message || "Invlid access token"  )  
 }
});
