const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lobbySchema = new Schema({
    current: String,
    max: String,
    host: String,
    permanent: Boolean,
    name: String
});

module.exports = {
    name: "lobby",
    schema: lobbySchema
};