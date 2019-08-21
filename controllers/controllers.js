const mongoose = require('mongoose');
const Items = mongoose.model('items');
const Users = mongoose.model('users');
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
    if (req.session && req.session.user) { // Check if session exists
        // lookup the user in the DB by pulling their email from the session
        Users.findOne({ email: req.session.user.email }, function (err, user) {
            if (!user) {
                // if the user isn't found in the DB, reset the session info and
                // redirect the user to the login page
                req.session.reset();
                res.redirect('/');
            } else {
                // expose the user to the template
                res.locals.user = user;
                let gradeAdjusted = [];
                for (let i = 0; i < 7; i++){
                    gradeAdjusted[i] = req.session.user.grade[i] * 10;
                }
                res.render(path.join(__dirname, '../views/home.jade'), { user: user, gradeFormat : gradeAdjusted });
            }
        });
    } else {
        res.redirect('/');
    }
};

/* User logged out, direct them to log in screen and remove session data*/

const logOut = function(req, res) {
    req.session.reset();
    res.redirect('/');
};

/*Plain API displaying functions from earlier prototypes removed for brevity and professionalism. findAllItems kept
* for functionality in recycling directory*/

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
        } else {
            if (req.body.psw === user.passwordHash) {
                req.session.user = user;
                let currentDate = new Date()
                let currentDay = currentDate.getDay();
                if (user.lastvisited !== currentDay){
                    req.session.user.grade[currentDay] = 0;
                    req.session.user.lastvisited = currentDay;
                }
                updateUser(req, res);
                let gradeAdjusted = [];
                for (let i = 0; i < 7; i++){
                    gradeAdjusted[i] = req.session.user.grade[i] * 10;
                }

                res.render(path.join(__dirname, '../views/home.jade'), { user: user, gradeFormat : gradeAdjusted });
                }
            else {
                res.send('Invalid email or password.');
            }
        }
    });
};


const getGrades = function (req, res) {

    let bestScore = [];
    let highest = 0;
    for (let j = 0; j < 7; j++){
        if (req.session.user.grade[j] > highest){
            bestScore[0] = req.session.user.grade[j];
            bestScore[1] = j;
            highest = bestScore[0];
        }
    }
    let gradeAdjusted = [];
    for (let i = 0; i < 7; i++){
        gradeAdjusted[i] = req.session.user.grade[i] * 10;
    }
    updateUser(req, res);

    res.render(path.join(__dirname, '../views/grade.jade'), { user: req.session.user, gradeFormat: gradeAdjusted,
                                                                bestGrade: bestScore});
};

/*Update user information, whether it be grade, user details or other*/

const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};

/* User navigated to MyAccount, display the myAccount page*/

const getAccount = function (req, res) {
    let gradeAdjusted = [];
    for (let i = 0; i < 7; i++){
        gradeAdjusted[i] = req.session.user[i] * 5;
    }
    res.render(path.join(__dirname, '../views/Account.jade'), { user: req.session.user, gradeFormat : gradeAdjusted });
};

/* User navigated to recycling directory, display the directory page*/

const getDirectory = function (req, res) {
    res.sendFile(path.join(__dirname, '../views/directory.html'));
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

/* User recycled an item, increment their score for the day*/

const handleRecycling = function(req, res) {
    req.session.user.grade[new Date().getDay()] = req.session.user.grade[new Date().getDay()] + 1;
    updateUser(req, res);
    validateUser(req, res);
};

/*--------------------Function Exports---------------------------*/

module.exports.createUser = createUser;
module.exports.findAllItems = findAllItems;
module.exports.createUser = createUser;
module.exports.handleLogin = handleLogin;
module.exports.validateUser = validateUser;
module.exports.logOut = logOut;
module.exports.getGrades = getGrades;
module.exports.getAccount = getAccount;
module.exports.getDirectory = getDirectory;
module.exports.updateAccount = updateAccount;
module.exports.handleRecycling = handleRecycling;
