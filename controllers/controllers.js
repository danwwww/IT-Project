const mongoose = require('mongoose');
const Items = mongoose.model('item_table');
const Users = mongoose.model('user_table');
const path = require('path');

/*Create a new user with entered username, password, email and default avatar and bio. Set scores to 0*/

const createUser = function (req, res) {
        const user = new Users({
            "username":req.body.username,
            "email":req.body.email,
            "passwordHash":req.body.passwordHash,
            "Avatar": "https://www.pphfoundation.ca/wp-content/uploads/2018/05/default-avatar.png",
            "grade": [0,0,0,0,0,0,0],
            "lastvisited": 0,
            "bio": "Proud member of our recycling community!"
        });
        user.save(function (err) {
            if (!err) {
                res.sendFile(path.join(__dirname, '../views/landing.html'));
            }
            else {
                res.end('You were not added');
            }
        });
};

/*Ensure a user is logged in otherwise do not allow them to access website functionalities. NOTE: must log in to
* be able to test functions*/

const validateUser = function (req, res) {
    if (req.session && req.session.user) Users.findOne({email: req.session.user.email}, function (err, user) {
        if (!user) {
            // if the user isn't found in the DB, reset the session info and
            // redirect the user to the login page
            req.session.reset();
            res.redirect('/');
        } else {
            //
            res.locals.user = user;
            /**
             handleLogin
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


/* User attempted a log in, check email and password against database. If successful store their user information in
 * session data to help templating and updating user info whilst on the site */
const handleLogin = function(req, res) {
    Users.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
            res.send('Invalid email or password.');
            /**
             * also direct to the error message page
             */
            /** ask how to render...
             * */

        } else {
            if (req.body.psw === user.passwordHash) {
                req.session.user = user;
                let currentDate = new Date()
                let currentDay = currentDate.getDay();
                //reset the lastvisited
                if (user.lastvisited !== currentDay) {
                    req.session.user.grade[currentDay] = 0;
                    req.session.user.lastvisited = currentDay;
                }
                updateUser(req, res);
                /** ask how to render...
                 * */
            }
            else {
                res.send('Invalid email or password.');
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
    /** ask how to render...
     * */
    res.render(path.join(__dirname, '../views/Account.jade'), { user: req.session.user, gradeFormat : gradeAdjusted });
};

/* User entered new information to their account, update it*/

const updateAccount = function(req, res){
    if (req.body.uname){
        req.session.user.username = req.body.uname;
    }
    if (req.body.bio){
        req.session.user.bio = req.body.bio;
    }
    if (req.body.avatar) {
        req.session.user.Avatar = req.body.avatar;
    }
    updateUser(req, res);
    getAccount(req, res);
};

/*--------------------Function Exports---------------------------*/

module.exports.createUser = createUser;
module.exports.findAllItems = findAllItems;
module.exports.handleLogin = handleLogin;
module.exports.validateUser = validateUser;
module.exports.logOut = logOut;
module.exports.getAccount = getAccount;
module.exports.updateAccount = updateAccount;
