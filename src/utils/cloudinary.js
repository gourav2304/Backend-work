import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"
 

    // Configuration
    cloudinary.config({ 
        cloud_name: 'doujwq7ny', 
        api_key: '913857754551532', 
        api_secret: '<your_api_secret>' // Click 'View API Keys' above to copy your API secret
    });


    const uploadFileFromCloudinary =async (localFilePath){
       try {
        if(!localFilePath)return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })
         // file has been uploaded successfull
        console.log("Sucessfully uploaded on cloudnary ",
            response.url); 
            return response
        
       } catch (error) {
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation got failed 
        return null;
       }
        
    }


    export {uploadOnCloudinary}