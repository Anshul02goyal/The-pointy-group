require('dotenv').config();
const mongoose = require('mongoose');

function connectToDB(){
    mongoose.connect(process.env.MONGO_URL).catch(err => console.log(err));
}

module.exports = connectToDB;