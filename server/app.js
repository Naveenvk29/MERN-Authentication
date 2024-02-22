import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import usersRoutes from "./Routes/user.Routes.js"
const app=express()
app.use(cors({origin:"*"}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/v1/user",usersRoutes)
app.get("/",(req,res)=>{
    res.send("its work my body")
})

export {app}