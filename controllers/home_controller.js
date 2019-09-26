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
                res.render(path.join(__dirname, '../views/home.jade'), {messages : message,image_path:user.currentFamily+".jpg"});
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

    form.parse(req, function(error, fields, files) {
        Users.findOne({ id: current_user_id }, function(err, user) {
            console.log(user);
            console.log("parsing done");
            console.log(files.upload.path);
            fs.writeFileSync("views/"+user.currentFamily+".jpg", fs.readFileSync(files.upload.path));
            var familyPhoto = new FamilyPhotos();
            familyPhoto.path = user.currentFamily+".jpg";
            Message.findOne(function(err, message) {
                console.log(message);
                res.render(path.join(__dirname, '../views/home.jade'), {messages : message,image_path:user.currentFamily+".jpg"});
            });
        });
    });
};

/*--------------------Function Exports---------------------------*/
module.exports.getHome = getHome;
module.exports.saveMessage = saveMessage;
module.exports.savePhoto = savePhoto;