import User from "../Model/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import otpGenerator from "otp-generator";

const Verifyuser= asyncHandler(async(req,res)=>{
  
    const {userName}=req.method=="GET" ? req.query :req.body
    const exist=await User.findOne({userName})
    if(!exist){
      res.status(404)
      throw new ApiError(404,"Can't find User")
    
    }else{
      res.status(404)
      throw new Error (404,"Authentciation error")
    }
  } 
    
  
)

const register = asyncHandler(async (req, res) => {
  const { userName, email, fullName, password } = req.body;
  if (
    [fullName, email, userName, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ userName }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or userName already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    userName,
    email,
    fullName,
    password: hashedPassword,
  });

  if (newUser) {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      userName: newUser.userName,
      fullName: newUser.fullName,
      email: newUser.email,
    });
  } else {
    throw new ApiError(400, "invailed user data");
  }
});

const login = asyncHandler(async (req, res) => {
  const { email, userName, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "username or email is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { userName }],
  });

  if (user) {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      createToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      throw new ApiError(401, "invaild password");
    }
  } else {
    throw new ApiError(401, "user is not found");
  }
});

const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(201).json("user successfully logout");
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new ApiError("User not found.");
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.userName || user.userName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      userName: updatedUser.userName,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new ApiError(404, "User not found");
  }
});

const genreateOTP = async (req, res) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ code: req.app.locals.OTP });
};

const verifyOtp = asyncHandler(async (req, res) => {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({ msg: "Verify Successsfully!" });
  }
  res.status(400);
  throw new ApiError(404, "User not found");
});

const createResetSession = asyncHandler(async (req, res) => {
  if (req.app.locals.resetSession) {
    return res.status(201).send({ flag: req.app.locals.resetSession });
  }
  res.status(440);
  throw new ApiError(440, "Session expired!");
});

// const resetPassword = asyncHandler(async (req, res) => {

// if(!req.app.locals.resetSession ){
//   res.status(440)
// throw new ApiError(440,"seeion expired")
// }

// const {userName,password}=req.body

// const user= await User.findOne({userName})
// if(user){
//   const salt= await bcrypt.genSalt(10)
//   const hashedPassword=await bcrypt.hash(password,salt) 
  
// }
// const 

// });

const resetPassword=asyncHandler(async(req,res)=>{
  try {
        
    if(!req.app.locals.resetSession) return res.status(440).send({error : "Session expired!"});

    const { username, password } = req.body;

    try {
        
        UserModel.findOne({ username})
            .then(user => {
                bcrypt.hash(password, 10)
                    .then(hashedPassword => {
                        UserModel.updateOne({ username : user.username },
                        { password: hashedPassword}, function(err, data){
                            if(err) throw err;
                            req.app.locals.resetSession = false; // reset session
                            return res.status(201).send({ msg : "Record Updated...!"})
                        });
                    })
                    .catch( e => {
                        return res.status(500).send({
                            error : "Enable to hashed password"
                        })
                    })
            })
            .catch(error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error })
    }

} catch (error) {
    return res.status(401).send({ error })
}

})


export {
  register,
  login,
  logout,
  getUser,
  updateUserProfile,
  genreateOTP,
  verifyOtp,
  createResetSession,
  resetPassword,
  Verifyuser
};
