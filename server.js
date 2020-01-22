import express from 'express';
import multer from 'multer';
import ejs from 'ejs';
import path from 'path';

//set storage engine
const storage = multer.diskStorage({
    destination: './public/upload/',
    filename: function(req,file,cb){
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

//init upload
const upload = multer({
    storage : storage ,  //get from variable name at storage engine
    limits : {fileSize:2000000}, //ex : limit 2MB
    fileFilter:function(req, file, cb){
        checkFileType(file, cb);
    }
    
}).single('foto') //get name from components name

//check file type
function checkFileType(file,cb){
    const filetypes=/jpg|jpeg|png|gif/; //alowed ext
    
    //check ext
    const extname=filetypes.test(path.extname(file.originalname).toLowerCase());
    
    //check mime
    const mimetype=filetypes.test(file.mimetype);

    //check if ext is true
    if (mimetype && extname){
        return cb(null,true);
    }else {
        cb ('error : Images Only')
    }

}
// init App
const app = express();

//EJS
app.set('view engine', 'ejs');

//Public Folder
app.use(express.static('./public'));

app.get('/',(req, res) => res.render('index'));
app.post('/upload', (req,res)=>{
   upload(req, res, (err) =>{
       if(err){
           res.render('index',{
               status : 'Error',
               msg: err
           })
       }else{
          //handle if no image selected
          if (req.file == undefined){
              res.render('index', {
                status : 'Error',
                msg :'Error : No File Selected !'
              })
          } else {
            res.render('index', {
                msg :'File Uploaded !',
                file : `upload/${req.file.filename}`
            })
          }
       }

   })
})
const port = 5000;
app.listen(port,() => console.log(`Server listened on port ${port}`))