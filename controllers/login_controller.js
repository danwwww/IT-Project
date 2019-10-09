//import modules
var express = require('express');
var formidable = require("formidable");
var fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
mongoose.set('useFindAndModify', false);
//these are from items.js
const Users = mongoose.model('account_tables');
const Message = mongoose.model('message_tables');
const FamilyPhotos = mongoose.model('familyPhoto_tables');
var current_user_id;

/*open welcome page*/
const welcome = function(req, res){
    console.log("called welcome");
    res.sendFile(path.join(__dirname, '../views/login.html'));
}


/*Create a new user with entered username, password, email */
const createUser = function (req, res) {
    /** check if account has already existed
     * */
    Users.findOne({ id: req.body.userId }, function(err, user) {
        if (user) {
            console.log("user existed");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"User ID already existed", returnPage:"login"});
        }
        else {
            console.log("new id");
            Users.findOne({ id: req.body.email }, function(err, email) {
                if (email) {
                    console.log("email existed");
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"User email already existed", returnPage:"login"});
                }
                else {
                    console.log("new email");
                    const user = new Users({
                        "id":req.body.userId,
                        "username":req.body.username,
                        "email":req.body.email,
                        "passwordHash":req.body.psw,
                        "currentFamily":"noFamily",
                    });
                    user.save(function (err) {
                        console.log(err);
                        if (!err) {
                            console.log("register successful, now going to account page and join a family");
                            console.log(Message[0]);
                            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"register successful, now going to account page and join a family", returnPage:"account"});
                        }
                        else {
                            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Registration failed, please try again", returnPage:"login"});
                        }
                    });
                }
            });
        }
    });
};


/* User attempted a log in, check email and password against database. If successful store their user information in
 * session data to help templating and updating user info whilst on the site */
const handleLogin = function(req, res) {
    Users.findOne({ id: req.body.userId }, function(err, user) {
        console.log(req.body.userId);
        console.log(req.body.psw);
        if (!user) {
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"User ID does not exist, please try again", returnPage:"home"});
            //should direct to error page later
        } else {
            if (req.body.psw === user.passwordHash) {
                req.session.user = user;
                updateUser(req, res);
                //login successful
                Message.findOne(function(err, message) {
                    console.log(message);
                    console.log("in handle login, current fam="+user.currentFamily);
                    res.redirect("/home");
                });
            }
            else {
                /**should jump to error message page then automatically jump to the login page after a few seconds
                 * */
                res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"User ID and password do not match, please try again", returnPage:"home"});
            }
        }
    });
};


/*Update user information*/
const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};


/*--------------------Function Exports---------------------------*/
module.exports.welcome = welcome;
module.exports.createUser = createUser;
module.exports.handleLogin = handleLogin;