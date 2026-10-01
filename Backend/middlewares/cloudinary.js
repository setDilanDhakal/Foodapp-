
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import "dotenv/config";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});



const uploadOnCloudinary = async (localfile) => {
    try {
        const uploadFile = await cloudinary.uploader.upload(localfile, {
            resource_type: "auto"
        });
        fs.unlinkSync(localfile)
        console.log("File upload successful");
        return uploadFile.secure_url;

    } catch (e) {
        fs.unlinkSync(localfile);
        console.log("Unable to upload file", e);
        return null;
    }
}

export {
    uploadOnCloudinary
}