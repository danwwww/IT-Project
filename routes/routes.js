const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require("../node_modules/body-parser");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


//import controllers
const other_controllers = require('../controllers/other_controllers.js');
const home_controller = require('../controllers/home_controller.js');
const login_controller = require('../controllers/login_controller.js');
const account_controller = require('../controllers/account_controller.js');
const family_controller = require('../controllers/family_controller.js');
const artifacts_controller = require('../controllers/artifacts_controller.js');


/*Main navigation routes, function details/comments in controller entry*/


//handle login logic
router.post('/login', login_controller.handleLogin);
router.get('/login', login_controller.welcome);
router.post('/', login_controller.createUser);
router.get('/', login_controller.welcome);
router.post('/register', login_controller.createUser);

//handle home page operations
router.get('/home', home_controller.getHome);
router.post('/saveMessage', home_controller.saveMessage);
router.post('/savePhoto', home_controller.savePhoto);

//user guide
router.get('/guide', other_controllers.guide);


//handle artifacts page operations
router.get('/artifacts', artifacts_controller.showArtifacts);
router.get('/uploadArtifacts', artifacts_controller.uploadArtifacts);
router.post('/upload/artifacts/submit', artifacts_controller.submitUploadArtifacts);
router.delete('/deleteItem/:id',artifacts_controller.deleteItem);
router.post('/updateItem', artifacts_controller.updateItem);
router.post('/search', artifacts_controller.search);


//handle family page operations
router.get('/family', family_controller.showProfiles);
router.post('/upload/profiles/submit', family_controller.submitUploadProfiles);
router.get('/uploadProfiles', family_controller.uploadProfiles);
router.post('/updateProfile', family_controller.updateProfiles);
router.delete('/deleteProfile/:id',family_controller.deleteProfile);


//handle account page operations
router.get('/account', account_controller.getAccount);
router.post('/createFamily', account_controller.createFamily);
router.post('/joinFamily', account_controller.joinFamily);
router.get('/logout', account_controller.logOut);
router.post('/updateAccount', account_controller.updateAccount);
router.post('/saveProfilePhoto', account_controller.saveProfilePhoto);


/*----------------------file paths for local views----------------------------*/

router.get('/css/bootstrap.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/bootstrap.css'));
});
router.get('/css/font-awesome.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/font-awesome.css'));
});
router.get('/css/head_style.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/head_style.css'));
});
router.get('/css/lightbox.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/lightbox.css'));
});
router.get('/css/home.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/home.css'));
});
router.get('/register.html', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});

module.exports = router;
