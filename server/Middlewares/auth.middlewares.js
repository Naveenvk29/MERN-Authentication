import jwt from "jsonwebtoken"
import User from "../Model/user.model.js"
import asyncHandler from "../utils/asyncHandler.js"

const auth=asyncHandler(async(req,res)=>{
    let token
    token=req.cookies.jwt
    if(token){
        try {
            const decoded=await jwt.verify(token,process.env,JWT_SECRET)
            req.user=await User.findById((decoded.userId).select("-password"))
            next()
        } catch (error) {
            res.status(401);
            throw new Error("Not authorized, token failed.");
        }
    }else{
        res.status(401);
        throw new Error("Not authorized, no token");
    }

})

const localVariables=asyncHandler(async(req,res)=>{
    req.app.locals={
        OTP:null,
        resetSession:false
    }
    next()
})

export {auth, localVariables}