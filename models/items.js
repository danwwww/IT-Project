

const mongoose = require("mongoose");
require('mongoose-type-url');

/*A recycling item*/

const itemSchema = mongoose.Schema(
    {
        "name":String,
        "category":String,
        "method":String,
        "photo":mongoose.SchemaTypes.Url
    }
);

/*A user of the system, including their grade*/

const userSchema = mongoose.Schema(
    {
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
        },
        "grade": {
            type: Array,
            required: true
        },
        "Avatar": {
            type: String,
            required: true
        },
        "bio": {
            type: String,
            required: true
        },
        "lastvisited": {
            type: Number,
            required: true
        }
    }
);

var gradeSchema = mongoose.Schema(
    {
        "username": String,
        "score": String
    }
);

module.exports = mongoose.model('items', itemSchema);
module.exports = mongoose.model('users', userSchema);
module.exports = mongoose.model('grades', gradeSchema);