const express = require('express');
const path = require('path');
const router = express.Router();
const bodyParser = require("../node_modules/body-parser");

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());


const controller = require('../controllers/controllers.js');

/*Main navigation routes, function details/comments in controller entry*/

router.get('/logout', controller.logOut);

router.post('/register', controller.createUser);

router.post('/directory', controller.handleRecycling);

router.get('/directory', controller.getDirectory);

router.get('/home', controller.validateUser);

router.get('/grade', controller.getGrades);

router.get('/account', controller.getAccount);

router.post('/account', controller.updateAccount);

//Find all list items
router.get('/directory/items/api',controller.findAllItems);

//handle login logic
router.post('/login', controller.handleLogin);

router.post('/', controller.createUser);

router.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/landing.html'));
});

/*----------------------file paths for local views----------------------------*/

router.get('/css/landing.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/landing.css'));
});
router.get('/css/bootstrap.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/bootstrap.css'));
});
router.get('/css/font-awesome.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/font-awesome.css'));
});
router.get('/css/head_style.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/head_style.css'));
});
router.get('/css/directory.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/directory.css'));
});

router.get('/css/lightbox.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/lightbox.css'));
});
router.get('/images/recycling_home.jpg', function(req, res) {
    res.sendFile(path.join(__dirname, '../images/recycling_home.jpg'));
});
router.get('/css/home.css', function(req, res) {
    res.sendFile(path.join(__dirname, '../css/home.css'));
});
router.get('/register.html', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});
router.get('/images/chart.png', function(req, res) {
    res.sendFile(path.join(__dirname, '../images/chart.png'));
});

module.exports = router;