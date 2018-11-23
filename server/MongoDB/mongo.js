const mongoose = require('mongoose');
const path = require("path")

require('dotenv').config({path: path.join(__dirname, '../../.env')});

mongoose.connect(process.env.DB_URL, {
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true
});