import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const verifyJWT = asyncHandler(async(req, res, next)=> {
   try {
     const token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer", "")
 
     if (!token) {
         throw new ApiError(401, "Unauthorized request")
 
     }
 
     const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRATE)
 
     const user = await User.findById(decodedToken?._id).select("-password")
 
     if (!user) {
         // add frountend feature
         throw new ApiError(401, "iNVALID ACCESS TOKEN")
     }
     
     req.user = user
     next()
   } catch (error) {
        throw new ApiError(401, error?.massage || "invalid token")
   }


})