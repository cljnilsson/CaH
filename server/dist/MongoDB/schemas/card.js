const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cardSchema = new Schema({
    type: String,
    text: String,
});
module.exports = {
    name: "cards",
    schema: cardSchema
};
//# sourceMappingURL=card.js.map