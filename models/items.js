

const mongoose = require("mongoose");
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
const userSchema = mongoose.Schema(
    {
        "_id": {
            type: String,
            required: true,
        },
        "username":{
            type: String,
            required: true
        },
        "email": {
            type: String,
            required: true,
        },
        "passwordHash": {
            type: String,
            required: true
        }
    }
);


module.exports = mongoose.model('items', itemSchema);
module.exports = mongoose.model('users', userSchema);
