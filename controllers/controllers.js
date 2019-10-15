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
var current_user_id;

/** Storage Engine */
const storageEngine = multer.diskStorage({
    destination: './public/files',
    filename: function(req, file, fn){
        fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
    }
});

const search = function(req, res) {
    console.log("called search function");
    const query = "/^" + req.body.searchText + "/";
    console.log(query);
    Items.find({ name: { '$regex': req.body.searchText, $options: 'is' }}, function(err, items) {
        if (err) throw err;
        res.render(path.join(__dirname, '../views/artifacts_test.jade'), {item : items});
    });
};

const upload =  multer({
    storage: storageEngine,
    limits: { fileSize:200000 },
    fileFilter: function(req, file, callback){
        validateFile(file, callback);
    }
}).single('photo');

const validateFile = function(file, cb ){
    allowedFileTypes = /jpeg|jpg|png|gif/;
    const extension = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType  = allowedFileTypes.test(file.mimetype);
    if(extension && mimeType){
        return cb(null, true);
    }else{
        cb("Invalid file type. Only JPEG, PNG and GIF file are allowed.")
    }
}

//delete an item
const deleteItem = function(req, res) {
    console.log("deleteItem function called");
    var itemID = req.params.id;
    Items.remove(
        {_id:itemID}, function(err, items) {
            console.log(itemID);
            //if deletion has failed, print error message
            if (err) {
                console.log("called deleteItem but error");
                console.log(err);
            }
            //if deletion has succeeded, refresh item page
            else {
                console.log("called deleteItem, deletion succeed and trying to direct to artifacts page");
            }
        });
};

//delete a profile
const deleteProfile = function(req, res) {
    console.log("deleteProfile function called");
    var profileID = req.params.id;
    Profiles.remove(
        {_id:profileID}, function(err, profiles) {
            console.log(profileID);
            //if deletion has failed, print error message
            if (err) {
                console.log("called deleteProfile but error");
                console.log(err);
            }
            //if deletion has succeeded, refresh item page
            else {
                console.log("called deleteProfile, deletion succeed and trying to direct to family page");
            }
        });
};

/*show artifacts page*/
const showArtifacts = function (req, res) {
    console.log("trying to go artifacts page");
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
            console.log("in validating function, validation successed");
            Items.find({familyId: req.session.user.currentFamily}, function (err, items) {
                if (!err) {
                    console.log("currently  on artifacts page");
                    console.log(items);
                    res.render(path.join(__dirname, '../views/artifacts_test.jade'), {item : items});
                } else {
                    res.sendStatus(400);
                }
            });

        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }

};

/*show profiles page*/
const showProfiles = function (req, res) {
    console.log("trying to go family page");
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
            console.log("in validating function, validation successed");
            Profiles.find({familyId: req.session.user.currentFamily}, function (err, profiles){
                if (!err) {
                    console.log("currently on family page");
                    res.render(path.join(__dirname, '../views/family_test.jade'), {profile : profiles});

                } else {
                    res.sendStatus(400);
                }
            }).sort( { year: 1, month: 1 ,date:1});

        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }

};

/*show upload artifacts page*/
const uploadArtifacts = function (req, res) {
    res.sendFile(path.join(__dirname, '../views/upload_artifacts.html'));
};

/*show upload profiles page*/
const uploadProfiles = function (req, res) {
    res.sendFile(path.join(__dirname, '../views/upload_profile.html'));
};

/*submit upload artifacts*/
const submitUploadArtifacts = function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        var name = fields.name;
        fs.writeFileSync("views/user_images/artifactsPhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg", fs.readFileSync(files.image.path));
        fs.writeFileSync("views/user_videos/artifactsVideos/"+name+".mp4", fs.readFileSync(files.video.path));
        var item = new Items({
            "name": fields.name,
            "date": fields.year,
            "owner": fields.owner,
            "keeper": fields.keeper,
            "location": fields.location,
            "description": fields.description,
            "category": fields.category,
            "familyId":req.session.user.currentFamily,
            "image": "user_images/artifactsPhotos/"+req.session.user.currentFamily+"SEPARATOR"+fields.name+".jpg",
            "video": "user_videos/artifactsVideos/"+fields.name+".mp4",
        });
        console.log("image path="+item.image);
        item.save(function (err) {
            console.log(err);
            if (!err) {
                //adding successful
                //res.render(path.join(__dirname, '../views/alert_message.jade'));

                res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"successfully Added a New Artifact",returnPage :"artifacts"});
            }
            else {
                //adding failed
                res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Artifacts",returnPage :"artifacts"});
                /**should also jump to error message page
                 * */
            }
        });
    });
};

/*submit upload profiles*/
const submitUploadProfiles = function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        var name = fields.name;
        fs.writeFileSync("views/user_images/profilePhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg", fs.readFileSync(files.image.path));
        fs.writeFileSync("views/user_videos/profileVideos/"+name+".mp4", fs.readFileSync(files.video.path));
        var profile = new Profiles({
            "name": fields.name,
            "year": fields.year,
            "month": fields.month,
            "day": fields.day,
            "description": fields.description,
            "life_story": fields.life_story,
            "year_passed": fields.year_passed,
            "familyId": req.session.user.currentFamily,
            "image": "user_images/profilePhotos/"+req.session.user.currentFamily+"SEPARATOR"+fields.name+".jpg",
            "video": "user_videos/profileVideos/"+fields.name+".mp4",
        });
        console.log("image path="+profile.image);
        profile.save(function (err) {
            console.log(err);
            if (!err) {
                /** the file is to be made and changed
                 * */
                res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"successfully To Add a New Profile",returnPage :"family"});
            }
            else {
                res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Profile",returnPage :"family"});
                /**should also jump to error message page
                 * */
            }
        });
    });
};

/*Update user information*/
const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};

/*--------------------Function Exports---------------------------*/

module.exports.deleteItem = deleteItem;
module.exports.deleteProfile = deleteProfile;
module.exports.showArtifacts = showArtifacts;
module.exports.uploadArtifacts = uploadArtifacts;
module.exports.submitUploadArtifacts = submitUploadArtifacts;
module.exports.showProfiles = showProfiles;
module.exports.uploadProfiles = uploadProfiles;
module.exports.submitUploadProfiles = submitUploadProfiles;
module.exports.search = search;