import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../../public/temp')// making this file public show that it upload without any intruption
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)// for now we are using orignalfile name but in future we have to change and make it for adding more implement
    }
})

  
  const upload = multer({ storage: storage })