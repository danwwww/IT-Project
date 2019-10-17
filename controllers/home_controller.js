//import modules
var express = require('express');
var formidable = require("formidable");
var fs = require('fs');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
const path = require('path');
const multer = require('multer');


//these are from items.js
const Message = mongoose.model('message_tables');
const FamilyPhotos = mongoose.model('familyPhoto_tables');
const Users = mongoose.model('account_tables');
var current_user_id;

/* User navigated to home Page*/
const getHome = function (req, res) {
    console.log("in validateUser: validating");
    if (req.session && req.session.user) Users.findOne({id: req.session.user.id}, function (err, user) {
        console.log("in validateUser: user ="+user);
        if (!user) {
            // if the user isn't found in the DB, reset the session info and
            // redirect the user to the login page
            req.session.reset();
            res.redirect('/');
        } else {
            console.log(user);
            res.locals.user = user;
            current_user_id = user.id;
            console.log("in getHome, current_user_id)="+current_user_id);
            console.log("in validating function, validation successed");
            Message.findOne({familyId: user.currentFamily }, function(err, message)  {
                console.log("message="+message);
                console.log("current fam="+user.currentFamily);
                //check if the user has joined a family but the family has no photo
                FamilyPhotos.findOne({family_id: user.currentFamily }, function(err, photo) {
                    //if has no family photo
                    if (!photo){
                        //if the user doesn't not have a family, ask to join
                        console.log("user has family without photo");
                        res.render(path.join(__dirname, '../views/home.jade'), {messages : message.message,image_path:"/user_images/familyPhotos/addPhoto.jpg"})
                    }
                    //if finds corresponding family photo
                    else{
                        // if the user has a family but the family has no photo, ask to upload
                        if (user.currentFamily == "noFamily"){
                            console.log("user has no family");
                            res.render(path.join(__dirname, '../views/home.jade'), {messages : message.message,image_path:"/user_images/familyPhotos/noFamily.jpg"});
                        }else{
                            res.render(path.join(__dirname, '../views/home.jade'), {messages : message.message,image_path:"/user_images/familyPhotos/"+user.currentFamily+".jpg"});

                        }
                    }
                });
            });
        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }
};


/* save message at home page*/
const saveMessage = function(req, res) {
    console.log("saveMessage function called");
    var message = req.body.message;
    Users.findOne({ id: current_user_id }, function(err, user) {
        Message.findOneAndUpdate({ familyId: user.currentFamily }, {message: req.body.message},function(err, user) {});
        console.log(req.body.message);
        console.log(message);
        getHome(req, res);
    });
};

const savePhoto = function(req, res) {
    //first of all, if user do not have a family, alert and ask to join or create family
    Users.findOne({ id: current_user_id }, function(err, user) {
        if(user.currentFamily=="noFamily"){
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                    "yet, so you may not upload a family photo", returnPage:"account"});
        }
    });
    var form = new formidable.IncomingForm();
    //current_user_id = req.body.userId;
    console.log("about to parse");
    console.log("in savephoto, current_user_id)="+current_user_id);
    form.parse(req, function(error, fields, files) {
        Users.findOne({ id: current_user_id }, function(err, user) {
            console.log(user);
            //write to local
            fs.writeFileSync("views/user_images/familyPhotos/"+user.currentFamily+".jpg", fs.readFileSync(files.upload.path));
            //upload to ali-oss
            let OSS = require('ali-oss');
            let client = new OSS({
                region: '<oss-ap-southeast-2>',
                //云账号AccessKey有所有API访问权限，建议遵循阿里云安全最佳实践，部署在服务端使用RAM子账号或STS，部署在客户端使用STS。
                accessKeyId: '<为什么一直重名啊>',
                accessKeySecret: '<Znftaobao374,>',
                bucket: '<itprojectmystery>'
            });
            async function put () {
                try {
                    console.log("******************")
                    console.log("putting image to oss");
                    console.log("******************")
                    // object表示上传到OSS的Object名称，localfile表示本地文件或者文件路径
                    let r1 = await client.put(user.currentFamily+".jpg","views/user_images/familyPhotos/"+user.currentFamily+".jpg");
                    console.log("本地路径="+"views/user_images/familyPhotos/"+user.currentFamily+".jpg");
                    console.log('put success: %j', r1);
                    // let r2 = await client.get(user.currentFamily);
                    // console.log('get success: %j', r2);
                } catch(e) {
                    console.log("fail to upload to ali oss");
                    console.error('error: %j', err);
                }
            }
            put();
            var familyPhoto = new FamilyPhotos();
            familyPhoto.path = "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/"+user.currentFamily+".jpg";
            console.log("new image path="+familyPhoto.path);

            FamilyPhotos.findOne({ family_id: user.currentFamily }, function(err, famPhoto) {
                // if the family is first time having a photo, save it in database
                if (!famPhoto){
                    console.log("first time uploading photo");
                    const photo = new FamilyPhotos({
                        "path":familyPhoto.path,
                        "family_id":user.currentFamily,
                    });
                    photo.save(function (err) {});
                }
                //if the familly is updating the photo, update in database
                else{
                    console.log("updating photo");
                    FamilyPhotos.findOneAndUpdate({family_id: user.currentFamily},{path:familyPhoto.path}, function(err, user) {});
                }
            });

            Message.findOne({ familyId: user.currentFamily },function(err, message) {
                console.log(message);
                res.render(path.join(__dirname, '../views/home.jade'), {messages : message.message,image_path:familyPhoto.path});
            });
        });
    });
};

/*--------------------Function Exports---------------------------*/
module.exports.getHome = getHome;
module.exports.saveMessage = saveMessage;
module.exports.savePhoto = savePhoto;