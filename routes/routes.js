
const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require("../node_modules/body-parser");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


const controller = require('../controllers/controllers.js');
const home_controller = require('../controllers/home_controller.js');
const login_controller = require('../controllers/login_controller.js');
const account_controller = require('../controllers/account_controller.js');


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
router.get('/guide', controller.guide);

router.get('/artifacts', controller.showArtifacts);
router.get('/uploadArtifacts', controller.uploadArtifacts);
router.post('/upload/artifacts/submit', controller.submitUploadArtifacts);
router.get('/family', controller.showProfiles);
router.post('/upload/profiles/submit', controller.submitUploadProfiles);
router.get('/uploadProfiles', controller.uploadProfiles);



router.delete('/deleteItem/:id',controller.deleteItem);
router.delete('/deleteProfile/:id',controller.deleteProfile);
//router.delete('/editItem/:id/:name', controller.updateItem);
router.post('/updateItem', controller.updateItem);

//handle account page operations
router.get('/account', account_controller.getAccount);
router.post('/createFamily', account_controller.createFamily);
router.post('/joinFamily', account_controller.joinFamily);
router.get('/logout', account_controller.logOut);
router.post('/updateAccount', account_controller.updateAccount);
router.post('/saveProfilePhoto', account_controller.saveProfilePhoto);

router.post('/search', controller.search);




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
