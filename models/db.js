const mongoose = require("mongoose");

//copy from CONNECT (MongoDB Atlas)
//validate db manager access info
const dbURI =
    "mongodb+srv://developer:it123project@cluster0-c3ing.mongodb.net/test?retryWrites=true&w=majority";


//choose the corresponding database
const options = {
    useNewUrlParser: true,
    dbName: "ItProject"
};

mongoose.connect(dbURI, options).then(
    () => {
    console.log("Database connection established!");
},
err => {
    console.log("Error connecting Database instance due to: ", err);
}
);

require('./items.js');