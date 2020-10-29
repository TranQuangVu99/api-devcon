const express = require('express')
const router = express.Router()
const fs = require('fs')

router.post('/upload_images',(req,res)=>{
    let formidoble = require('formidable')
    let form = new formidoble.IncomingForm()
    form.uploadDir = './images' // địa chỉ lưu
    form.keepExtensions = true // đuôi mở rộng
    form.maxFieldsSize = 10 * 1024 * 1024 // tối đa 10 Mb
    form.multiples = true  // up nhiều file
    form.parse(req,(err,fields,files)=>{
        if(err){
            res.status(400).json({msg:'upload fail',err})
        }
        let arr = files[""] //mảng trả về số phần tử đã update
        if(arr.length>0){
            let fileName = []
            arr.forEach(file => {
                fileName.push(file.path.split('\\')[1])
            })
            res.status(201).json({data:fileName})
        }
        else
        {
            res.status(400).json({msg:'No Images to upload'})
        }

    })
})

router.get('/open_image/:id',(req,res)=>{
   let imagesURI = `images/${req.params.id}`
   fs.readFile(imagesURI,(err,imageData)=>{
       if(err)
        return res.status(400).json(err);
        res.writeHead(200,{'Content-Type':'image/jpeg'})
        res.end(imageData)
   })
})

module.exports = router