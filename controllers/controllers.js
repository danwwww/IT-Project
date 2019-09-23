const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
var express = require('express');
var fs = require('fs');
//these are from items.js
const Items = mongoose.model('item_tables');
const Users = mongoose.model('account_tables');
const Profiles = mongoose.model('profile_tables');
const Message = mongoose.model('message_tables');
const FamilyPhotos = mongoose.model('familyPhoto_tables');


//const Families = mongoose.model('family_tables');



const path = require('path');

/**-------------------------------------------------------------------------------------------------------------------
 * below: login related operations
 * -------------------------------------------------------------------------------------------------------------------
 * */


/*done: open welcome page*/
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
            //should direct to error page later

        }
        else {
            console.log("new id");
        }
    });
    Users.findOne({ id: req.body.email }, function(err, email) {
        if (email) {
            console.log("email existed");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"User email already existed", returnPage:"login"});
            //should direct to error page later

        }
        else {
            console.log("new email");
        }
    });



        const user = new Users({
            "id":req.body.userId,
            "username":req.body.username,
            "email":req.body.email,
            "passwordHash":req.body.psw,
        });
        user.save(function (err) {
            console.log(err);
            if (!err) {
                /** the file is to be made and changed
                 * */
                console.log("register successful, now going to home page");
                console.log(Message[0]);
                res.render(path.join(__dirname, '../views/home.jade'), {messages : " "});
            }
            else {
                res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Registration failed, please try again", returnPage:"login"});
                /**should also jump to error message page
                 * */
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




/*list all users
* */
const findAllUsers = function (req, res) {
    Users.find({}, function (err, user) {
        if (!err) {
            res.send(user);
        } else {
            res.sendStatus(400);
        }
    });
};




const findAllProfiles = function (req, res) {
    Profiles.find({}, function (err, user) {
        if (!err) {
            res.send(user);
        } else {
            res.sendStatus(400);
        }
    });
};

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
                    res.render(path.join(__dirname, '../views/home.jade'), {messages : message});
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
            console.log("in validating function, validation successed");
            Message.findOne(function(err, message) {
                console.log(message);
                res.render(path.join(__dirname, '../views/home.jade'), {messages : message});
            });
        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }


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
            res.sendFile(path.join(__dirname, '../views/account.html'));

        }
    }); else {
        console.log("in validating function, validation failed");
        req.session.reset();
        res.redirect('/');
    }

};

/* User entered new information to their account, update it*/
const updateAccount = function(req, res){
    if (req.body.uname){
        req.session.user.username = req.body.uname;
    }

    if (req.body.familyId){
        req.session.user.familyId = req.body.familyId;
    }
    updateUser(req, res);
    getAccount(req, res);
};


/* save message at home page*/
const saveMessage = function(req, res) {
    console.log("saveMessage function called");
    var message = req.body.message;
    Users.findOne({ id: req.body.userId }, function(err, user) {
        Message.findOneAndUpdate(req.body.message, {message: req.body.message},function(err, user) {});
        console.log(req.body.message);
        console.log(message);
        //res.render(path.join(__dirname, '../views/home.jade'), {messages : message});
        getHome(req, res);
    });
    // res.render(path.join(__dirname, '../views/home.jade'), {messages : message});

};


/* save photo at home page*/
const savePhoto = function(req, res) {
    console.log("savePhoto function called");
    console.log(req.body.familyPhoto);
    var familyPhoto = new FamilyPhotos();
    familyPhoto.img.data = req.body.familyPhoto;
    familyPhoto.img.contentType = 'image/png';
    console.log("-------");
    console.log((req.body.familyPhoto).toString('base64'));
    console.log(familyPhoto.img.data.toString('base64'));
    console.log(familyPhoto.img.contentType);
    familyPhoto.save();
    res.render(path.join(__dirname, '../views/photo_test.jade'), {familyPhoto: familyPhoto.img.data.toString('base64')});
};

// const savePhoto= function(req, res) {
//     var multiparty = require("multiparty");
//     var form = new multiparty.Form();
//     form.parse(req, function(err,fields,files){
//         var img = files.familyPhoto;
//         var fs = require("fs");
//         fs.readFile(img.path, function(err, data){
//             var path = "./public/images/"+img.originalFilename;
//             fs.writeFile(path, data, function(error) {
//                 if(error) console.log(error);
//                 res.render('phpto_test', {familyPhoto:img});
//             });
//         });
//
//     });
//
//
// }

/**-------------------------------------------------------------------------------------------------------------------
 * above:  navigation bar operations
 * -------------------------------------------------------------------------------------------------------------------
 * */




/*--------------------Function Exports---------------------------*/

module.exports.welcome = welcome;
module.exports.getHome = getHome;

module.exports.saveMessage = saveMessage;
module.exports.savePhoto = savePhoto;

module.exports.createUser = createUser;
module.exports.handleLogin = handleLogin;
module.exports.logOut = logOut;

module.exports.findAllUsers = findAllUsers;
module.exports.deleteItem = deleteItem;
module.exports.deleteProfile = deleteProfile;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
module.exports.showArtifacts = showArtifacts;
module.exports.uploadArtifacts = uploadArtifacts;
module.exports.submitUploadArtifacts = submitUploadArtifacts;

module.exports.findAllProfiles = findAllProfiles;
module.exports.showProfiles = showProfiles;
module.exports.uploadProfiles = uploadProfiles;
module.exports.submitUploadProfiles = submitUploadProfiles;

