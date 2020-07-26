const multer = require('multer');
const path = require('path');

// define and set destination file for profile picture(avatar)
const storage_avatar = (destination) => {
    multer.diskStorage({
    // set destination from params
       destination: destination,
       filename: (req, file, callback)=>{
           // set filename and the extenstion, so it basicly convert from binary file into real file
        return callback(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
       }
   })
}

module.exports = {
    storage_avatar :storage_avatar
}