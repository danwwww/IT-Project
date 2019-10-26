//import modules
const mongoose = require('mongoose');
const path = require('path');
mongoose.set('useFindAndModify', false);


/*
page: User Guide
usage: 1. shown after registration, 2. navigation bar
contributor: Chen
* */
const guide = function(req, res) {
    console.log("called guide");
    res.sendFile(path.join(__dirname, '../views/guide.html'));
};


/*--------------------Function Exports---------------------------*/
module.exports.guide = guide;
