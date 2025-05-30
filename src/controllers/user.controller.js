import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId); //user having specific instance that is unique userId
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // console.log("Access Token:", accessToken); // Debugging step
    // console.log("Refresh Token:", refreshToken); // Debugging step

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating access and refresh token "
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  // get user detail from frontend
  // validation will be use - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // uplaod them to cloudnary avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { fullName, email, username, password } = req.body;
  console.log("email: ", email);
  if (
    [email, password, username, fullName].some((field) => field?.trim === "") // this for getting al the field from every email,  password, username,fullName agar nahi hn toh error thorw kar degga
  ) {
    throw new ApiError(400, "All field are required");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  // console.log("username :",username ,"email", email);

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar files is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar is required ");
  }

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password: password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user ");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Sucessfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //username or password
  // find user
  //password check
  //acesstoken and refresh token
  // send cookie

  const { email, username, password } = req.body;

  if (!(username || email)) {
    throw new ApiError(400, "username or email is required ");
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(400, "user does not exist ");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(400, "please enter a valid password ");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user,
          loggedUser,
          accessToken,
          refreshToken,
        },
        "user logged In sucessfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("acessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logout sucessfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  console.log(incomingRefreshToken);
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorised request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid Token ");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired or used ");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token  ");
  }
});
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body; // if want to use confirm password feature so use it here in req.bodand use validation commented next to this

  if (!(confirmPassword === newPassword)) {
    throw new ApiError(401, "Invalid confirm password");
  }

  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "current user sucessfully");
});

const updateAccountDetail = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  if (!(fullName || email)) {
    throw new ApiError(400, "All field required ");
  }

  User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName: fullName,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user updated sucessfully"));
});
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw ApiError(400, "Avatar files miising 0r  required ");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, " Error while uploading  the file");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar sucessfully updated"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const CoverImageLocalPath = req.file?.path;
  if (!CoverImageLocalPath) {
    throw ApiError(400, "CoverImage files miising 0r  required ");
  }
  const CoverImage = await uploadOnCloudinary(CoverImageLocalPath);

  if (!CoverImage.url) {
    throw new ApiError(400, " Error while uploading  the file");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { CoverImage: CoverImage.url },
    },
    { new: true }
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "CoverImage sucessfully updated"));
});
const getUserChannelProfile = asyncHandler(async (req, res) => {

  const { username } = req.params

  if (!username?.trim()) {
    throw new (ApiError(400, "Username is not found"))
  }

  const channel =await User.aggregate([
    {
        $match: {
          username: username?.toLowerCase()
        }
    },
    {
      $lookup: 
      {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",   // added pipeline for finding subscriber throw channel
        as: "subscribers"
    }
        
    },
    {
      $lookup: 
      {
        from: "subscriptions",
        localField: "_id",  //  added pipeline for finding subscriber whom they subscribe
        foreignField: "subcriber",
        as: "subscribedTo"
      }
    },
    {
      $addFields: {
        subscribersCount: {
            $size: "$subscribers"
        },
        channelsSubscribedToCount: {
            $size: "$subscribedTo"
        },
        isSubscribed: {
            $cond: {
                if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                then: true,
                else: false
            }
        }
      }
    },
    {
      $project: {
          fullName: 1,
          username: 1,
          subscribersCount: 1,
          channelsSubscribedToCount: 1,
          isSubscribed: 1,
          avatar: 1,
          coverImage: 1,
          email: 1

      }
    }
  ])

  if (!channel?.length) {
    throw new ApiError(400, "channel is not found")
  }

  return res.status(200)
  .json( new ApiResponse , channel[0], " user channel fetched sucessfully ")
})

const watchUserHistory = asyncHandler(async(req,res)=>{
  User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.objectId(req.user._id)

      }
    },{
      $lookup:{
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [{
            $lookup: 
        }]
      }
    }
])
})
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetail,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile
};


