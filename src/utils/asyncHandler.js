const asyncHandler = (requestHandler)=>{
    (req,res,next)=>{
        Promise.resolve(requestHandler(req,res,next)) // passing request function here 
        .catch((err)=>{next(err)})
    }
 }



export {asyncHandler}

// const asyncHandler= ()=>{}
// const asyncHandler= ()=>{()=>{}}
// const asyncHandler= ()=> async ()=>{}

// const asyncHandler = (fn)=> async () => {
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(err.code|| 500).json({
//             success: false,// this success flag
//             message: err.message,
//         })
//     }
// }