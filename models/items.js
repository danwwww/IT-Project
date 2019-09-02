


const mongoose = require("mongoose");

var Schema = mongoose.Schema;
require('mongoose-type-url');

/* treasure item */
const itemSchema = mongoose.Schema(
    {
        "_id": {
            type: String,
            required: true,
        },
        "name":{
            type: String,
            required: true
        },
        "category": String,
        "photo": mongoose.SchemaTypes.Url,
        "date_created": Date,
        "date_refurbished": Date,
        "creator": String,
        "current_owner": String,
        "location": String,
        "description": String,
        "familyId": {
            type: String,
            required: true,
        }
    }
);

/*user*/
const userSchema = new Schema(
    {
        id: {
            type: String,
            required: true,
        },
        username:{
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
        },
        passwordHash: {
            type: String,
            required: true
        }
    }
);
var User = mongoose.model('userSchema', userSchema);
var a = new User({
    id: "aaa",
    username: "42531423",
    email: "222@qq.com",
    passwordHash: "a"
})
//保存数据库
a.save(function(err) {
    if (err) {
        console.log('保存失败')
        return;
    }
    console.log('meow');
});


module.exports = mongoose.model('item_table', itemSchema);
module.exports = mongoose.model('account_table', userSchema);

