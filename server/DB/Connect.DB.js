import mongoose from "mongoose";

const connectDB=async()=>{
    try {
        await  mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connection is successfully🤝`);
    } catch (error) {
        console.log({error:error.message});
    }

}
 
export default connectDB