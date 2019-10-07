//import modules
var express = require('express');
var formidable = require("formidable");
var fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
mongoose.set('useFindAndModify', false);
//these are from items.js
const Items = mongoose.model('item_tables');
const Users = mongoose.model('account_tables');
const Profiles = mongoose.model('profile_tables');
const Message = mongoose.model('message_tables');
const FamilyPhotos = mongoose.model('familyPhoto_tables');
const Family = mongoose.model('family_tables');
var currentFamily;

const getAccount = function (req, res) {
    console.log("in get Account");
    console.log("get account timer finished");
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
            console.log("in validating function, validation successed");
            res.render(path.join(__dirname, '../views/account.jade'), {username : user.username, familyId :user.currentFamily});

        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }

};

/*create new family*/
const createFamily = function (req, res) {
    /*check if family id exist*/
    Family.findOne({ id: req.body.familyId }, function(err, family1) {
        if (family1) {
            console.log("family existed");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"family ID already existed", returnPage:"account"});
        }
        else {
            console.log("new family id");
            const family = new Family({
                "id": req.body.familyId,
                "name": req.body.familyName,
                "pwd": req.body.familyPassword,
            });
            family.save();
            /*check if use family is full, if not, add to the new family*/
            Users.findOne({'id': req.session.user.id}, function (err, user) {
                if (!user.familyId1 || user.familyId1 == "") {
                    Users.findOneAndUpdate({id: user.id}, {familyId1: req.body.familyId}, function (err, user) {
                    });
                    // Users.findOneAndUpdate({id: user.id}, {currentFamily: req.body.familyId}, function (err, user) {
                    // });
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {
                        errorMessage: "create family successful, now going to account page",
                        returnPage: "account"
                    });
                    console.log('join family to family 2 successful');
                } else if(!user.familyId2 || user.familyId2 == ""){
                    Users.findOneAndUpdate({id: user.id}, {familyId2: req.body.familyId}, function (err, user) {
                    });
                    // Users.findOneAndUpdate({id: user.id}, {currentFamily: req.body.familyId}, function (err, user) {
                    // });
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {
                        errorMessage: "create family successful, now going to account page",
                        returnPage: "account"
                    });
                }else if(!user.familyId3 || user.familyId3 == ""){
                    Users.findOneAndUpdate({id: user.id}, {familyId3: req.body.familyId}, function (err, user) {
                    });
                    // Users.findOneAndUpdate({id: user.id}, {currentFamily: req.body.familyId}, function (err, user) {
                    // });
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {
                        errorMessage: "create family successful, now going to account page",
                        returnPage: "account"
                    });
                } else {
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {
                        errorMessage: "create family failed, because you have joined 3 families",
                        returnPage: "account"
                    });
                }
            });
        }
    });
};

/*user join family*/
const joinFamily = function (req, res) {
    console.log("1");
    /*check if family id exist*/
    Family.findOne({ id: req.body.familyId }, function(err, family1) {
        if (!family1) {
            console.log("family ID don't exist");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"family ID don't exist", returnPage:"account"});
        }
        else {
            console.log("new family id");
            const family = new Family({
                "id": req.body.familyId,
                "pwd": req.body.familyPassword,
            });
            /*find true family password and check matches the user's input*/
            Family.findOne({ id: req.body.familyId }, function(err, family2){
                if(family2){
                    const trueFamilyPassword = family2.pwd;
                    if(trueFamilyPassword != req.body.familyPassword){
                        console.log('family password dont match');
                        res.render(path.join(__dirname, '../views/alert_message.jade'), {
                            errorMessage: "join family failed, password don't match",
                            returnPage: "account"
                        });
                    }else{
                        /*check if use family is full, if not, add to the new family*/
                        Users.findOne({'id': req.session.user.id}, function (err, user) {
                            if (!user.familyId1 || user.familyId1 == "") {
                                Users.findOneAndUpdate({id: user.id}, {familyId1: req.body.familyId}, function (err, user) {
                                });
                                res.render(path.join(__dirname, '../views/alert_message.jade'), {
                                    errorMessage: "join family successful, now going to account page",
                                    returnPage: "account"
                                });
                                console.log('join family to family 2 successful');
                            } else if(!user.familyId2 || user.familyId2 == ""){
                                Users.findOneAndUpdate({id: user.id}, {familyId2: req.body.familyId}, function (err, user) {
                                });
                                res.render(path.join(__dirname, '../views/alert_message.jade'), {
                                    errorMessage: "join family successful, now going to account page",
                                    returnPage: "account"
                                });
                            }else if(!user.familyId3 || user.familyId3 == ""){
                                Users.findOneAndUpdate({id: user.id}, {familyId3: req.body.familyId}, function (err, user) {
                                });
                                res.render(path.join(__dirname, '../views/alert_message.jade'), {
                                    errorMessage: "join family successful, now going to account page",
                                    returnPage: "account"
                                });
                            } else {
                                res.render(path.join(__dirname, '../views/alert_message.jade'), {
                                    errorMessage: "join family failed, because you have joined 3 families",
                                    returnPage: "account"
                                });
                            }
                        });
                    }
                }
            });


        }
    });
};

/* User update  user account in account page*/
const updateAccount = function(req, res){
    console.log("called updateAccount");
    //if change username
    if (req.body.username){
        req.session.user.username= req.body.username;
        console.log("req.body.username="+req.body.username);
        console.log("req.session.user.username="+req.session.user.username);
        Users.findOneAndUpdate(req.session.user.username, {username: req.body.username},function(err, user) {});
        updateUser(req,res);
        Users.findOne({'id': req.session.user.id}, function (err, user) {
            res.render(path.join(__dirname, '../views/account.jade'), {username : req.body.username, familyId :user.currentFamily});
        });
    }
    //if swtich familyId
    else if (req.body.familyId){
        console.log("input id ="+req.body.familyId);
        console.log("session.famid="+req.session.user.currentFamily);
        console.log("session user ="+req.session.user);
        //before letting switch, check if the user has already joined a family with this id
        Users.findOne({'id': req.session.user.id}, function (err, user) {
            var fam1 = user.familyId1;
            var fam2 = user.familyId2;
            var fam3 = user.familyId3;
            if (req.body.familyId != fam1 && req.body.familyId != fam2 && req.body.familyId != fam3){
                console.log("wrong familyId");
                res.render(path.join(__dirname, '../views/alert_message.jade'), {
                    errorMessage:"Families you have already joined include "+fam1 +", " +
                        fam2+", and "+ fam3 +", " +
                        "while your input was not one of them, please check again!", returnPage:"account"});
            }
            else{
                console.log("correct family id");
                Users.findOneAndUpdate(req.session.user.currentFamily, {currentFamily: req.body.familyId},function(err, user) {});
                currentFamily = req.body.familyId;
                req.session.user.currentFamily = req.body.familyId;
                updateUser(req,res);
                res.render(path.join(__dirname, '../views/account.jade'), {username : user.username, familyId :currentFamily});
            }
        });
    }
    //in case of db is slower than page direction, add a timer
    //intervalFunc(50000);


};


function intervalFunc(time) {
    i = 0;
    while(i<time){
        time -= Math.random();
        console.log(time);
    }
    console.log("**********timer finished***************");
}


/* User logged out, direct them to log in screen and remove session data*/
const logOut = function(req, res) {
    req.session.reset();
    res.redirect('/');
};

const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};
/*--------------------Function Exports---------------------------*/
module.exports.getAccount = getAccount;
module.exports.logOut = logOut;
module.exports.createFamily = createFamily;
module.exports.joinFamily = joinFamily;
module.exports.updateAccount = updateAccount;