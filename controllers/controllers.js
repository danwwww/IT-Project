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


/** Storage Engine */
const storageEngine = multer.diskStorage({
    destination: './public/files',
    filename: function(req, file, fn){
        fn(null,  new Date().getTime().toString()+'-'+file.fieldname+path.extname(file.originalname));
    }
});

//init

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
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {
                        errorMessage: "create family successful, now going to home page",
                        returnPage: "account"
                    });
                    console.log('join family to family 2 successful');
                } else if(!user.familyId2 || user.familyId2 == ""){
                    Users.findOneAndUpdate({id: user.id}, {familyId2: req.body.familyId}, function (err, user) {
                    });
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {
                        errorMessage: "create family successful, now going to home page",
                        returnPage: "account"
                    });
                }else if(!user.familyId3 || user.familyId3 == ""){
                    Users.findOneAndUpdate({id: user.id}, {familyId3: req.body.familyId}, function (err, user) {
                    });
                    res.render(path.join(__dirname, '../views/alert_message.jade'), {
                        errorMessage: "create family successful, now going to home page",
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

/* User logged out, direct them to log in screen and remove session data*/
const logOut = function(req, res) {
    req.session.reset();
    res.redirect('/');
};

/**-------------------------------------------------------------------------------------------------------------------
 * above:  login related operations
 * -------------------------------------------------------------------------------------------------------------------
 * */



/**-------------------------------------------------------------------------------------------------------------------
 * below:  navigation bar operations
 * -------------------------------------------------------------------------------------------------------------------
 * */



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
            Items.find({}, function (err, items) {
                if (!err) {

                    console.log("currently  on artifacts page");
                    // app.use("/javascripts", express.static("./outJavascripts"));
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
            Profiles.find({}, function (err, profiles){
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
    const item = new Items({
        "name": req.body.name,
        "date": req.body.year,
        "owner": req.body.owner,
        "keeper": req.body.keeper,
        "location": req.body.keeper,
        "description": req.body.keeper,
        "category": req.body.category,
    });


    upload(req, res,(error) => {
        if (error) {
            res.send('fail');
        } else {
            if (req.body.image == undefined) {

                res.send('file undefined');

            } else {

                /**
                 * Create new record in mongoDB
                 */
                var fullPath = "files/" + req.body.image;

                var document = {
                    path: fullPath,
                };

                var photo = new Photo(document);
                photo.save(function (error) {
                    if (error) {
                        throw error;
                    }
                    console.log("file save success");
                });
            }
        }
    });

    item.save(function (err) {
        console.log(err);
        if (!err) {
            /** the file is to be made and changed
             * */
            res.redirect("/artifacts");
        }
        else {
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Artifacts",returnPage :"artifacts"});
            /**should also jump to error message page
             * */
        }
    });
};

/*submit upload profiles*/
const submitUploadProfiles = function (req, res) {
    const profile = new Profiles({
        "name": req.body.name,
        "year": req.body.year,
        "month": req.body.month,
        "day": req.body.day,
        "description": req.body.description,
        "life_story": req.body.life_story,
        "year_passed": req.body.year_passed,
    });

    profile.save(function (err) {
        console.log(err);
        if (!err) {
            /** the file is to be made and changed
             * */
            res.redirect("/family");
        }
        else {
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Profile",returnPage :"family"});
            /**should also jump to error message page
             * */
        }
    });
};




/*Update user information*/
const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};


const getAccount = function (req, res) {
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
            console.log("in validating function, validation successed");
            res.render(path.join(__dirname, '../views/account.jade'), {username : user.username, familyId :user.currentFamily});

        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }

};

/* User update  user account in account page*/
const updateAccount = function(req, res){
    console.log("called updateAccount");
    if (req.body.username){
        console.log(req.body.username);
        console.log(req.session.user.username);
        Users.findOneAndUpdate(req.session.user.username, {username: req.body.username},function(err, user) {});
        updateUser(req,res);
    }
    else if (req.body.familyId){
        console.log("input id ="+req.body.familyId);
        console.log("session.famid="+req.session.user.currentFamily);
        //before letting switch, check if the user has already joined a family with this id
        if (req.body.familyId != req.session.user.familyId1 && req.body.familyId != req.session.user.familyId2 && req.body.familyId != req.session.user.familyId3){
            console.log("wrong familyId");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {
                errorMessage:"Families you have already joined include "+req.session.user.familyId1 +", " +
                    req.session.user.familyId2+", and "+ req.session.user.familyId3 +", while your input was not one of them, please check again!", returnPage:"account"});
        }
        else{
            console.log("correct family id");
            Users.findOneAndUpdate(req.session.user.currentFamily, {currentFamily: req.body.familyId},function(err, user) {});
            req.session.user.currentFamily = req.body.familyId;
            updateUser(req,res);
        }

    }
    //in case of db is slower than page direction, add a timer
    setInterval(intervalFunc, 3000);
    console.log("timer finished");
    getAccount(req, res);

};


function intervalFunc() {
    console.log('timertimertimer!');
}





/*--------------------Function Exports---------------------------*/


module.exports.logOut = logOut;

module.exports.deleteItem = deleteItem;
module.exports.deleteProfile = deleteProfile;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
module.exports.showArtifacts = showArtifacts;
module.exports.uploadArtifacts = uploadArtifacts;

module.exports.submitUploadArtifacts = submitUploadArtifacts;

module.exports.showProfiles = showProfiles;
module.exports.uploadProfiles = uploadProfiles;
module.exports.submitUploadProfiles = submitUploadProfiles;

module.exports.createFamily = createFamily;

