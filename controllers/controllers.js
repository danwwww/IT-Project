const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
//these are from items.js
const Items = mongoose.model('item_table');
const Users = mongoose.model('account_table');
const Profiles = mongoose.model('profile_table');

//const Families = mongoose.model('family_table');



const path = require('path');

/**-------------------------------------------------------------------------------------------------------------------
 * below: login related operations
 * -------------------------------------------------------------------------------------------------------------------
 * */


/*done: open welcome page*/
const welcome = function(req, res){
    res.sendFile(path.join(__dirname, '../views/login.html'));

}



/*Create a new user with entered username, password, email */
const createUser = function (req, res) {
    /** check if account has already existed
     * */
    Users.findOne({ id: req.body.userId }, function(err, user) {
        if (user) {
            console.log("existed");
            res.send('userId already exist');
            //should direct to error page later

        }
        else {
            console.log("new");
        }
    });
    Users.findOne({ id: req.body.email }, function(err, user) {
        if (user) {
            console.log("existed");
            res.send('user email already exist');
            //should direct to error page later

        }
        else {
            console.log("new");
        }
    });



        const user = new Users({
            "id":req.body.userId,
            "username":req.body.username,
            "email":req.body.email,
            "passwordHash":req.body.psw,
        });

        //testing: printout the input username
        // console.log(req.body.userId);
        // console.log(req.body.username);
        // console.log(req.body.email);
        // console.log(req.body.psw);

        user.save(function (err) {
            console.log(err);
            if (!err) {
                /** the file is to be made and changed
                 * */
                res.sendFile(path.join(__dirname, '../views/home.html'));
            }
            else {
                res.end("register failed");
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
/*list all items to be shown on the 'my family treasure'
* */
const findAllItems = function (req, res) {
    validateUser(req, res);
    console.log("should have called validated");
    Items.find({}, function (err, items) {
        if (!err) {
            res.send(items);
        } else {
            res.sendStatus(400);
        }
    });
};

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
            Profiles.find({}, function (err, profiles) {
                if (!err) {
                    console.log("currently on family page");
                    res.render(path.join(__dirname, '../views/family_test.jade'), {profile : profiles});

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
            res.send('submit successful');
        }
        else {
            res.end("sumbit fail");
            /**should also jump to error message page
             * */
        }
    });
};

/*submit upload profiles*/
const submitUploadProfiles = function (req, res) {
    const profile = new Profiles({
        "name": req.body.name,
        "birthday": req.body.birthday,
        "description": req.body.description,
        "life_story": req.body.life_story,
    });

    profile.save(function (err) {
        console.log(err);
        if (!err) {
            /** the file is to be made and changed
             * */
            res.send('submit successful');
        }
        else {
            res.end("sumbit fail");
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
            confirm('userId not found');
            //should direct to error page later

        } else {
            if (req.body.psw === user.passwordHash) {
                req.session.user = user;
                updateUser(req, res);
                //do something!
                res.sendFile(path.join(__dirname, '../views/home.html'));

            }
            else {
                /**should jump to error message page then automatically jump to the login page after a few seconds
                 * */
                res.send(' email and password not match');
            }
        }
    });
};




/*Update user information*/
const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};

/* User navigated to accountPage*/
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
            res.sendFile(path.join(__dirname, '../views/home.html'));

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
/**-------------------------------------------------------------------------------------------------------------------
 * above:  navigation bar operations
 * -------------------------------------------------------------------------------------------------------------------
 * */




/*--------------------Function Exports---------------------------*/

module.exports.welcome = welcome;
module.exports.getHome = getHome;

module.exports.createUser = createUser;
module.exports.handleLogin = handleLogin;
module.exports.logOut = logOut;

module.exports.findAllItems = findAllItems;
module.exports.findAllUsers = findAllUsers;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
module.exports.showArtifacts = showArtifacts;
module.exports.uploadArtifacts = uploadArtifacts;
module.exports.submitUploadArtifacts = submitUploadArtifacts;

module.exports.findAllProfiles = findAllProfiles;
module.exports.showProfiles = showProfiles;
module.exports.uploadProfiles = uploadProfiles;
module.exports.submitUploadProfiles = submitUploadProfiles;

