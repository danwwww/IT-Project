

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
        "owner": String,
        "keeper": String,
        "location": String,
        "description": String,
        "owner": String,
        "location": String,
        "description": String,
        "photo": Object,
        "category":String,

    }
);

const messageSchema = mongoose.Schema(
    {
        "familyId" : String,
        "message" : String,
        "photo":Object,

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
        },
        "familyId1" : String,
        "familyId2" : String,
        "familyId3" : String,
        "currentFamily" : String,
    }
);


/*profiles*/
const profileSchema = mongoose.Schema(
    {
        "name": String,
        "year": Number,
        "month": Number,
        "day": Number,
        "description": String,
        "life_story": String,
        "year_passed": String,
    }
);

/*profiles*/
const familyPhotoSchema = mongoose.Schema(
    {
        img:
        {data: Buffer, contentType:String}
    }
);

module.exports = mongoose.model('item_tables', itemSchema);
module.exports = mongoose.model('message_tables', messageSchema);
module.exports = mongoose.model('account_tables', userSchema);
module.exports = mongoose.model('profile_tables', profileSchema);
module.exports = mongoose.model('familyPhoto_tables', familyPhotoSchema);