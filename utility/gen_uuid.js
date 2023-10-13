const uuid = require('uuid');


function genUUID(){
    id = uuid.v4();
    console.log(`creating uuid of ${id}`);
    return id;
}


module.exports = genUUID;