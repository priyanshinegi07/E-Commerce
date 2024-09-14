const {v2: cloudinary}  = require("cloudinary");
const fs = require("fs");
const path = require("path")

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_S
});


module.exports.uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        console.log("Uploading to Cloudinary...");

        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        // Log the response to verify it
        console.log("File uploaded to Cloudinary", response.secure_url);
        return response;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error.message);

        // Remove the file if upload fails
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
}
// module.exports.uploadOnCloudinary = async (localFilePath) => {
//     try {

//         if(!localFilePath) return null;
//         console.log("cloudinary")

//         //upload the file on cloudinary
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             //automatically detects which file is this
//             resource_type : "auto"
//         });
//         //file has been uploaded sucessfully
//         console.log("file is uploaded on cloudinary", response.secure_url);
//         return response;
//     } catch (error) {
//         //we remove the file coz this may result in malicious or corrupted file coz if it would have been ok then it would be uploaded on cloudinary

//         //we use sync coz first this unlink operation has to be performed and then other code
//         fs.unlinkSync(localFilePath);//remove the locally saved temporary file as the upload operation got failed
//         return null;
        
//     }
// }

// // export {uploadOnCloudinary}