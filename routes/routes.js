
const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require("../node_modules/body-parser");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


const controller = require('../controllers/controllers.js');
const home_controller = require('../controllers/home_controller.js');
const image_tester_controller = require('../controllers/image_tester_controller.js');


/*Main navigation routes, function details/comments in controller entry*/

router.get('/', controller.welcome);

//table testers
router.get('/users', controller.findAllUsers);
router.get('/profiles', controller.findAllProfiles);

router.get('/logout', controller.logOut);

router.post('/register', controller.createUser);

//router.get('/showImage', image_tester_controller.showImage);

router.get('/image', image_tester_controller.image);

router.post('/uploadImage', image_tester_controller.uploadImage);

router.get('/home', home_controller.getHome);
router.post('/saveMessage', home_controller.saveMessage);
router.post('/savePhoto', home_controller.savePhoto);


router.get('/account', controller.getAccount);

router.post('/updateAccount', controller.updateAccount);

router.get('/artifacts', controller.showArtifacts);

router.get('/uploadArtifacts', controller.uploadArtifacts);

router.post('/upload/artifacts/submit', controller.submitUploadArtifacts);

router.get('/family', controller.showProfiles);

router.post('/upload/profiles/submit', controller.submitUploadProfiles);

router.get('/uploadProfiles', controller.uploadProfiles);


router.delete('/deleteItem/:id',controller.deleteItem);
router.delete('/deleteProfile/:id',controller.deleteProfile);

router.post('/createFamily', controller.createFamily);



//handle login logic
router.post('/login', controller.handleLogin);
router.get('/login', controller.welcome);

router.post('/', controller.createUser);

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
