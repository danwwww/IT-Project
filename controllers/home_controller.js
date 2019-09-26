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
const Family = mongoose.model('family_tables');
const Users = mongoose.model('account_tables');
var current_user_id;

/* User navigated to home Page*/
const getHome = function (req, res) {
    console.log("in validateUser: validating");
    if (req.session && req.session.user) Users.findOne({email: req.session.user.email}, function (err, user) {
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
            console.log("in validating function, validation successed");
            Message.findOne(function(err, message) {
                console.log(message);
                res.render(path.join(__dirname, '../views/home.jade'), {messages : message,image_path:"/user_images/familyPhotos/"+user.currentFamily+".jpg"});
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
    Users.findOne({ id: req.body.userId }, function(err, user) {
        Message.findOneAndUpdate(req.body.message, {message: req.body.message},function(err, user) {});
        console.log(req.body.message);
        console.log(message);
        getHome(req, res);
    });
};


const savePhoto = function(req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    console.log("user_id"+current_user_id);
    form.parse(req, function(error, fields, files) {
        Users.findOne({ id: current_user_id }, function(err, user) {
            console.log(user);
            // console.log("parsing done");
            // console.log(files.upload.path);
            fs.writeFileSync("views/user_images/familyPhotos/"+user.currentFamily+".jpg", fs.readFileSync(files.upload.path));

            //corp the image to optimal showing size
            // const sharp = require('sharp');
            // original image
            // let originalImage = "views/user_images/familyPhoto"+user.currentFamily+".jpg";
            // file name for cropped image
            // let outputImage = "views/"+user.currentFamily+".jpg";
            // sharp(originalImage).extract({ width: 400, height: 300, left: 60, top: 40 }).toFile(outputImage)
            //     .then(function(new_file_info) {
            //         console.log("Image cropped and saved");
            //     })
            //     .catch(function(err) {
            //         console.log("An error occured");
            //     });
            var familyPhoto = new FamilyPhotos();
            familyPhoto.path = "/user_images/familyPhotos/"+user.currentFamily+".jpg";
            Message.findOne(function(err, message) {
                console.log(message);
                res.render(path.join(__dirname, '../views/home.jade'), {messages : message,image_path:familyPhoto.path});
            });
        });
    });
};

/*--------------------Function Exports---------------------------*/
module.exports.getHome = getHome;
module.exports.saveMessage = saveMessage;
module.exports.savePhoto = savePhoto;