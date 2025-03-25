import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
    
    });

    console.log(`✅ MongoDB connected! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("❌ MONGODB connection error:", error.message);
    process.exit(1); // Exit the process if connection fails
  }
};

export default connectDB;











// import mongoose from "mongoose"
// import { DB_NAME } from "../constants.js"

// const connectDB = async ()=>{
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         console.log(`\n MongoDB connected !! DB HOST:${connectionInstance.connection.host}`);
        
//     }catch (error) {
//         console.log("MONGODB connection error",error)
//         process.exit(1);
        
//     }
// }

// export default connectDB
