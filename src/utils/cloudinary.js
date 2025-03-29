import { v2 as cloudinary } from "cloudinary";
import fs from "fs"


// Configuration
cloudinary.config({
    cloud_name: 'doujwq7ny',
    api_key: '913857754551532',
    api_secret: "Ybmx1PtXYVH5ttDuh30GnlaROxY"
});


const uploadOnCloudinary = async (localFilePath) => {

    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded successfull
        // console.log("Sucessfully uploaded on cloudnary ", response.url);
        fs.unlinkSync(localFilePath)
        return response

    } catch (error) {
        console.log(error, "cld Error");
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload operation got failed 
        return null;
    }

}


export { uploadOnCloudinary }