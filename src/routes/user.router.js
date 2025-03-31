import { Router } from "express";
import {loginUser,logOutUser,registerUser} from "../controllers/user.controller.js"
import {upload} from "../middleware/multer.middleware.js"
import { verifyJwt } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
    {
        name: "avatar",
        maxCount:1
    },
    {
        name: "coverImage",
        maxcount:1
    }
    ]),
    registerUser)
router.route("/login").post(loginUser)


//serured routes

router.route("/logout").post(verifyJwt, logOutUser)// here is verifyJwt is a middle ware if this 
// work done then  with help of next() it move to logOutUser)

export default router