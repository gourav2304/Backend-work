import dotenv, { configDotenv } from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";




dotenv.config();

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running at port : ${process.env.PORT}`);
    }  )
})
.catch((err)=>{
    console.log("Mongo db connection failed !!!", err);
})
















// import express from "express";
// const app = express();


// (async()=>{
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/$
//             {DB_NAME}`)
//             app.on("error",()=>{
//                 console.log("error: Db connected to express",error);
//                 throw error
//             })

//             app.listen(process.env.PORT, ()=>{
//                 console.log(`App is listening on post ${process.env.PORT}`);
                
//             })
//     } catch (error) {
//         console.log("error", error)
//         throw err        
//     }
// })()

 