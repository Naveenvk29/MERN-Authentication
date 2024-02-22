import express from "express"
import {register,
    login,
    logout,
    getUser,
    updateUserProfile,
    genreateOTP,
    verifyOtp,
    createResetSession,
    resetPassword,Verifyuser} from "../Controllers/user.controller.js"
import registerMail from "../Controllers/mailer.js"
import {auth,localVariables} from "../Middlewares/auth.middlewares.js"

const router = express.Router();

router.post("/register",register)
router.post("/registerMail",registerMail)
router.post("/authticate",Verifyuser,(req,res)=>res.end)
router.post("/login",login)

router.get('/user/:username',getUser) // user with username
router.get('/generateOTP',localVariables,genreateOTP) // generate random OTP
router.get('/verifyOTP',verifyOtp) // verify generated OTP
router.get('/createResetSession',createResetSession) // reset all the variables


/** PUT Methods */
router.put('/updateuser',auth,updateUserProfile) // is use to update the user profile
router.put('/resetPassword',resetPassword) // use to reset password

export default router
