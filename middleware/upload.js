const multer=require("multer");
const Storage=multer.memoryStorage();

const uploads=multer({
    Storage,
    limits:{fileSize:5*1024*1024},
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith("image/"))
        {
            cb(null,true);
        }
        else
        {
            cb(new Error("please upload image file"),false);
        }
    }
})
module.exports={uploads};