

const path = require('path');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var express = require('express');
var formidable = require("formidable");
var fs = require('fs');
//these are from items.js
const Items = mongoose.model('item_tables');
const Users = mongoose.model('account_tables');
const Profiles = mongoose.model('profile_tables');
const Message = mongoose.model('message_tables');
const FamilyPhotos = mongoose.model('familyPhoto_tables');
const Family = mongoose.model('family_tables');



const uploadImage = function(req, res){
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        console.log("parsing done");
        console.log(files.upload.path);
        fs.writeFileSync("views/1.jpg", fs.readFileSync(files.upload.path));
        var familyPhoto = new FamilyPhotos();
        familyPhoto.path = "1.jpg";
        res.render(path.join(__dirname, '../views/show_image_tester.jade'), {image_path: familyPhoto.path});
    });

}
//     console.log("called upload image");
//     var imgData = req.body.asd;
//     console.log(imgData);
//     //过滤data:URL
//     var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
//     var dataBuffer = new Buffer.from(base64Data, 'base64');
//     console.log("base64Data="+base64Data);
//     console.log("buffer="+dataBuffer);
//     let timeData = new Date();
//     let time = timeData.getSeconds();
//     // fs.writeFile(`${time}.jpg`, dataBuffer, (err)=> {
//     fs.writeFile(`a.png`, dataBuffer, (err)=> {
//         if(err){
//             res.send(err);
//         }else{
//             res.send("保存成功");
//             //res.render(path.join(__dirname, '../views/show_image_tester.jade'), {buffer: dataBuffer.toString('base64')});
//         }
//     });
//
// }

// const showImage = function(req, res){
//     console.log("called show image");
//     res.render(path.join(__dirname, '../views/show_image_tester.jade'), {theImage: ""});
//
// }
const image = function(req, res){
    console.log("image");
    res.sendFile(path.join(__dirname, '../views/upload_image_tester.html'));
}

/*--------------------Function Exports---------------------------*/
module.exports.uploadImage = uploadImage;
module.exports.image = image;

//module.exports.showImage = showImage;