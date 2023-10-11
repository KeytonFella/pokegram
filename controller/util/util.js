const uuid = require('uuid');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

function genUUID(){
    id = uuid.v4();
    console.log(`creating uuid of ${id}`);
    return id;
}

function createJWT(username, uuid){
    return jwt.sign({
        username,
        uuid
    }, 'thisisasecret', {
        expiresIn: '7d'
    })
}

    /**
 * The JWT will be sent to the client
 * When the client sends the JWT back to the server, the server needs to check if the JWT is valid
 * (header + payload + signature) -> we need to verify that the signature was generated using our secret
 * You cannot forge any of the information inside of the payload or header, becuase the server will know that it was forged
 */

jwt.verify = Promise.promisify(jwt.verify); // Turn jwt.verify into a function that returns a promise

// verify
function verifyTokenAndReturnPayload(token){
    return jwt.verify(token, 'thisisasecret');
}

module.exports ={
        genUUID, createJWT, verifyTokenAndReturnPayload
    }