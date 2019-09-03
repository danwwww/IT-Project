const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
//these are from items.js
const Items = mongoose.model('item_table');
const Users = mongoose.model('account_table');

//const Profiles = mongoose.model('profile_table');
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
                res.sendFile(path.join(__dirname, '../views/account.html'));
            }
            else {
                res.end("register failed");
                /**should also jump to error message page
                 * */
            }
        });
};


/*Ensure a user is logged in otherwise do not allow them to access website's functionalities. NOTE: must log in to
* be able to test functions*/
const validateUser = function (req, res) {
    if (req.session && req.session.user) Users.findOne({email: req.session.user.email}, function (err, user) {
        if (!user) {
            // if the user isn't found in the DB, reset the session info and

            // redirect the user to the login page
            //req.session.reset();
            /**should jump to error message page then automatically jump to the login page after a few seconds
             * */
            //res.redirect('/');
        } else {
            //
            res.locals.user = user;
            /**
             handleLogin
            cookie set
             */

        }
    }); else {
        res.redirect('/');
    }
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
    Users.find({}, function (err, users) {
        if (!err) {
            res.send(users);
        } else {
            res.sendStatus(400);
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
            res.send('userId not found');
            //should direct to error page later

        } else {
            if (req.body.psw === user.passwordHash) {
                req.session.user = user;
                updateUser(req, res);
                //do something!
                res.sendFile(path.join(__dirname, '../views/account.html'));

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

/* User navigated to homePage*/
const getAccount = function (req, res) {
    res.sendFile(path.join(__dirname, '../views/account.html'));
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

module.exports.createUser = createUser;
module.exports.validateUser = validateUser;
module.exports.handleLogin = handleLogin;
module.exports.logOut = logOut;

module.exports.findAllItems = findAllItems;
module.exports.findAllUsers = findAllUsers;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
