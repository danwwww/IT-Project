//import modules
var formidable = require("formidable");
var fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
mongoose.set('useFindAndModify', false);


//these are from items.js
const Users = mongoose.model('account_tables');
const Profiles = mongoose.model('profile_tables');


/*
page: family
usage: 1. navigation bar 2. refresh after uploading new profile
contributor: Chen
* */
const showProfiles = function (req, res) {
    console.log("trying to go family page");
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
            Profiles.find({familyId: user.currentFamily}, function (err, profiles){
                if (!err) {
                    console.log("currently on family page");
                    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
                    //if user has no family
                    if(user.currentFamily == 'noFamily'){
                        console.log("no profile to be shown");
                        res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                                "yet, so you may now join or create a family.", returnPage:"account"});
                    }
                    //if user has family
                    else{
                        console.log("profiles need to be shown");
                        console.log(profiles[1]);
                        res.render(path.join(__dirname, '../views/family.jade'), {profile : profiles});
                    }
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


/*
page: Family(button) and uploadProfiles page
usage: 1. give user a form to fill if they want to upload profile when click 'upload' button on family page
2. upload profile on uploadProfile page on navigation bar
contributor: Zhehao
* */
const uploadProfiles = function (req, res) {
    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
    Users.findOne({id: req.session.user.id}, function (err, user) {
        //if user has no family
        if(user.currentFamily == 'noFamily'){
            console.log("no profile to be shown");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                    "yet, so you may now join or create a family.", returnPage:"account"});
        }
        else{
            res.sendFile(path.join(__dirname, '../views/upload_profile.html'));
        }
    });
};


/*
page: uploadProfile page
usage: save uploaded profile
contributor: Zhehao, Chen
* */
const submitUploadProfiles = function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        var name = fields.name;
        fs.writeFileSync("views/user_images/profilePhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg", fs.readFileSync(files.image.path));
        fs.writeFileSync("views/user_videos/profileVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4"
            , fs.readFileSync(files.video.path));
        let OSS = require('ali-oss');
        let client = new OSS({
            region: 'oss-ap-southeast-2',
            accessKeyId: 'LTAI4Fgy2os9YCfosNtJUtKS',
            accessKeySecret: 'UyxpOuIcixuZ3oJ6LHLX5VWSIqagaZ\n',
            bucket: 'itprojectmystery'
        });
        async function put () {
            try {
                let video = await client.put("profileVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
                    "views/user_videos/profileVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4");
                let image = await client.put("profilePhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
                    "views/user_images/profilePhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg");
            } catch(e) {
                console.log("fail to upload to ali oss");
                console.error('error: %j', err);
            }
        }
        put();
        var profile = new Profiles({
            "name": fields.name,
            "year": fields.year,
            "month": fields.month,
            "day": fields.day,
            "description": fields.description,
            "life_story": fields.life_story,
            "year_passed": fields.year_passed,
            "familyId": req.session.user.currentFamily,
            "image": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/profilePhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
            "video": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/profileVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
        });
        console.log("image path="+profile.image);
        profile.save(function (err) {
            console.log(err);
            if (!err) {
                /** the file is to be made and changed
                 * */
                res.redirect('/family');
            }
            else {
                 /**should also jump to error message page
                 * */
                res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Profile",returnPage :"family"});
            }
        });
    });
};


/*
page: Profile(on pop-up)
usage: 1. delete profile on its pop-up on family page
contributor: Chen
* */
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


//edit an profile
const updateProfiles = function(req, res) {
    console.log("editProfile function called");
    if(req.body.name) {
        console.log("update profile's name");
        Profiles.updateOne({_id: req.body.id}, {name: req.body.name}, function(err, suc){
            if(err){
                console.log("edit name fail");
            }else{
                console.log("edit name successful");
            }
        });
    }
    if(req.body.life_story){
        Profiles.updateOne({_id: req.body.id}, {life_story: req.body.life_story}, function(err, suc){
            if(err){
                console.log("edit life_story fail");
            }else{
                console.log("edit life_story successful");
            }
        });
    }
    if(req.body.description){
        Profiles.updateOne({_id: req.body.id}, {description: req.body.description}, function(err, suc){
            if(err){
                console.log("edit description fail");
            }else{
                console.log("edit description successful");
            }
        });
    }
    console.log('edit finished');
    showProfiles(req, res);
};


/*--------------------Function Exports---------------------------*/
module.exports.deleteProfile = deleteProfile;
module.exports.showProfiles = showProfiles;
module.exports.uploadProfiles = uploadProfiles;
module.exports.submitUploadProfiles = submitUploadProfiles;