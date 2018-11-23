
let schemas = [];

function add(obj) {
    schemas[obj.name] = obj.schema
    return obj.name;
}

add(require("./card"));
add(require("./lobby"));

module.exports.all = schemas;
module.exports.get = function(name) {
    return schemas[name];
}