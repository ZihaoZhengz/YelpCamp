const cloudinary=require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// make the cloudinary configurations. 
cloudinary.config({
    cloud_name:process.env.CLOUNDINARY_CLOUD_NAME,
    api_key:process.env.CLOUNDINARY_KEY,
    api_secret:process.env.CLOUNDINARY_SECRET
})

const storage=new CloudinaryStorage({
    cloudinary,
    params:{
    folder:"Yelpcamp",
    allowedFormats:['jpeg','jpg','png','pneg']
    }
})
module.exports={
    cloudinary,
    storage
}