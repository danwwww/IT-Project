

const mongoose = require("mongoose");
require('mongoose-type-url');

/* treasure item */
const itemSchema = mongoose.Schema(
    {
        "name":{
            type: String,
            required: true
        },
        "date": String,
        "owner": mongoose.SchemaTypes.Url,
        "keeper": String,
        "location": String,
        "description": String,
        "owner": String,
        "location": String,
        "description": String,
        "photo": String,
        "category":String,
    }
);

/*user*/
const userSchema = mongoose.Schema(
    {
        "id": {
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


module.exports = mongoose.model('item_table', itemSchema);
module.exports = mongoose.model('account_table', userSchema);