//import modules
var formidable = require("formidable");
var fs = require('fs');
const mongoose = require('mongoose');
const path = require('path');
mongoose.set('useFindAndModify', false);


//these are from items.js
const Items = mongoose.model('item_tables');
const Users = mongoose.model('account_tables');


/*
page: Artifacts
usage: 1. navigation bar 2. refresh after uploading new artifact 3. refresh after searching
contributor: Chen
* */
const showArtifacts = function (req, res) {
    console.log("trying to go artifacts page");
    if (req.session && req.session.user) Users.findOne({id: req.session.user.id}, function (err, user) {
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
            Items.find({familyId: user.currentFamily}, function (err, items) {
                if (!err) {
                    console.log("currently  on artifacts page");
                    console.log(items);
                    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
                    //if user has no family
                    if(user.currentFamily == 'noFamily'){
                        console.log("no artifact to be shown");
                        res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                                "yet, so you may now join or create a family.", returnPage:"account"});
                    }
                    else{
                        res.render(path.join(__dirname, '../views/artifacts.jade'), {item : items});
                    }
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


/*
page: Artifacts(on pop-up)
usage: 1. delete artifact on its pop-up on artifacts page
contributor: Chen
* */
const deleteItem = function(req, res) {
    console.log("deleteItem function called");
    var itemID = req.params.id;
    Items.remove(
        {_id:itemID}, function(err, items) {
            console.log(itemID);
            //if deletion has failed, print error message
            if (err) {
                console.log("called deleteItem but error");
                console.log(err);
            }
            //if deletion has succeeded, refresh item page
            else {
                console.log("called deleteItem, deletion succeed and trying to direct to artifacts page");
            }
        });
};


/*
page: Artifacts(on pop-up)
usage: 1. edit artifact on its pop-up on artifacts page
contributor: Zhehao
* */
const updateItem = function(req, res) {
    console.log("editItem function called");
    console.log("name: " + req.body.name);
    console.log("id: " + req.body.id);
    if(req.body.name) {
        console.log("update item's name");
        Items.updateOne({_id: req.body.id}, {name: req.body.name}, function(err, suc){
            if(err){
                console.log("edit name fail");
            }else{
                console.log("edit name successful");
            }
        });
    }
    if(req.body.date){
        Items.updateOne({_id: req.body.id}, {date: req.body.date}, function(err, suc){
            if(err){
                console.log("edit date fail");
            }else{
                console.log("edit date successful");
            }
        });
    }
    if(req.body.keeper){
        Items.updateOne({_id: req.body.id}, {keeper: req.body.keeper}, function(err, suc){
            if(err){
                console.log("edit keeper fail");
            }else{
                console.log("edit keeper successful");
            }
        });
    }
    if(req.body.location){
        Items.updateOne({_id: req.body.id}, {location: req.body.location}, function(err, suc){
            if(err){
                console.log("edit location fail");
            }else{
                console.log("edit location successful");
            }
        });
    }
    if(req.body.description){
        Items.updateOne({_id: req.body.id}, {location: req.body.description}, function(err, suc){
            if(err){
                console.log("edit description fail");
            }else{
                console.log("edit description successful");
            }
        });
    }
    if(req.body.owner){
        Items.updateOne({_id: req.body.id}, {owner: req.body.owner}, function(err, suc){
            if(err){
                console.log("edit owner fail");
            }else{
                console.log("edit owner successful");
            }
        });
    }
    if(req.body.category){
        Items.updateOne({_id: req.body.id}, {category: req.body.category}, function(err, suc){
            if(err){
                console.log("edit category fail");
            }else{
                console.log("edit category successful");
            }
        });
    }
    console.log('edit finished');
    showArtifacts(req, res);
};


/*
page: Artifacts(button)
usage: 1. search artifact when click 'search' button on artifacts page
contributor: Zhehao
* */
const search = function(req, res) {
    console.log("called search function");
    Items.find({ $and: [{ name: { '$regex': req.body.searchText, $options: 'is' }}, {familyId: req.session.user.currentFamily}]}, function(err, items) {
        if (err) throw err;
        res.render(path.join(__dirname, '../views/artifacts.jade'), {item : items});
    });
};


/*
page: Artifacts(button) and uploadArtifacts page
usage: 1. give user a form to fill if they want to upload artifact when click 'upload' button on artifacts page
2. upload artifact on uploadArtifacts page on navigation bar
contributor: Zhehao
* */
const uploadArtifacts = function (req, res) {
    //if user has no family, system shall not show all user without families on this page simply because user.currentFam = "noFam"
    Users.findOne({id: req.session.user.id}, function (err, user) {
        //if user has no family
        if(user.currentFamily == 'noFamily'){
            console.log("no profile to be shown");
            res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"You have not joined a family " +
                    "yet, so you may now join or create a family.", returnPage:"account"});
        }
        else{
            res.sendFile(path.join(__dirname, '../views/upload_artifacts.html'));
        }
    });
};


/*
page: uploadArtifacts page
usage: save uploaded artifact
contributor: Zhehao, Chen
* */
const submitUploadArtifacts = function (req, res) {
    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(req, function(error, fields, files) {
        var name = fields.name;
        fs.writeFileSync("views/user_images/artifactsPhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg", fs.readFileSync(files.image.path));
        fs.writeFileSync("views/user_videos/artifactsVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4"
            , fs.readFileSync(files.video.path));
        let OSS = require('ali-oss');
        let client = new OSS({
            region: 'oss-ap-southeast-2',
            accessKeyId: 'LTAI4Fgy2os9YCfosNtJUtKS',
            accessKeySecret: 'UyxpOuIcixuZ3oJ6LHLX5VWSIqagaZ\n',
            bucket: 'itprojectmystery'
        });
        async function put () {
            try {
                let video = await client.put("artifactsVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
                    "views/user_videos/artifactsVideos/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4");
                let image = await client.put("artifactsPhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
                    "views/user_images/artifactsPhotos/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg");
            } catch(e) {
                console.log("fail to upload to ali oss");
                console.error('error: %j', err);
            }
        }
        put();
        var item = new Items({
            "name": fields.name,
            "date": fields.year,
            "owner": fields.owner,
            "keeper": fields.keeper,
            "location": fields.location,
            "description": fields.description,
            "category": fields.category,
            "familyId":req.session.user.currentFamily,
            "image": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/artifactsPhoto/"+req.session.user.currentFamily+"SEPARATOR"+name+".jpg",
            "video": "https://itprojectmystery.oss-ap-southeast-2.aliyuncs.com/artifactsVideo/"+req.session.user.currentFamily+"SEPARATOR"+name+".mp4",
        });
        console.log("image path="+item.image);
        item.save(function (err) {
            console.log(err);
            if (!err) {
                //adding successful
                //res.render(path.join(__dirname, '../views/alert_message.jade'));
                Items.find({familyId: req.session.user.currentFamily}, function (err, items) {
                    res.redirect('/artifacts');
                });
            }
            else {
                //adding failed
                //res.render(path.join(__dirname, '../views/alert_message.jade'), {errorMessage:"Failed To Add New Artifacts",returnPage :"artifacts"});
                Items.find({familyId: req.session.user.currentFamily}, function (err, items) {
                    res.redirect('/artifacts');
                });
                /**should also jump to error message page
                 * */
            }
        });
    });
};


/*
page: non
usage: upload user session information
contributor: Chen
* */
const updateUser = function (req) {
    Users.findOneAndUpdate({username: req.session.user.username}, req.session.user, {new: true}, function(err, user) {});
};

/*--------------------Function Exports---------------------------*/
module.exports.deleteItem = deleteItem;
module.exports.showArtifacts = showArtifacts;
module.exports.uploadArtifacts = uploadArtifacts;
module.exports.submitUploadArtifacts = submitUploadArtifacts;
module.exports.search = search;
module.exports.updateItem = updateItem;