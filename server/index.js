import dotenv from "dotenv"
import connectDB from "./DB/Connect.DB.js"
import {app} from "./app.js"

dotenv.config()
const port=process.env.PORT
connectDB()
.then(()=>{
    app.listen(port, () => {
        console.log(`Server started on port ${port}`);
    });
})
.catch((err)=>{
    console.log(`something went ${err}`);
})