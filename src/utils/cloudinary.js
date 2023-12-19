import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:true
});

const uploadOnCloudinary = async (localFilePath) =>{
    try{
        if(!localFilePath) 
        return null
        //upload file on cloudinary
      const reponse = await  cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })
        //file has been upload successfully
       // console.log("File is uploaded successfully",reponse.url);
       fs.unlinkSync(localFilePath)
        return reponse
    }
    catch(error){
     fs.unlinkSync(localFilePath)//remove locally saved temp file as upload failed
     return null
    }
}

export {uploadOnCloudinary}
