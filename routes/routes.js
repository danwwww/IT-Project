
const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require("../node_modules/body-parser");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


const controller = require('../controllers/controllers.js');

/*Main navigation routes, function details/comments in controller entry*/

router.get('/', controller.welcome);

//table testers
router.get('/users', controller.findAllUsers);
router.get('/items', controller.findAllItems);

router.get('/logout', controller.logOut);

router.post('/register', controller.createUser);

router.get('/home', controller.getHome);


router.get('/account', controller.getAccount);

router.post('/account', controller.updateAccount);

router.get('/artifacts', controller.showArtifacts);

router.get('/upload', controller.uploadArtifacts);

router.post('/upload', controller.submitUploadArtifacts);

//Find all list items
router.get('/directory/items/api',controller.findAllItems);


//handle login logic
router.post('/login', controller.handleLogin);

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
