const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

function createJWT(user_id, username, role){
    return jwt.sign({
        user_id,
        username,
        role
    }, 'blastingoffagain', {
        expiresIn: '1d'
    })
}

jwt.verify = Promise.promisify(jwt.verify); // Turn jwt.verify into a function that returns a promise

// verify
function verifyTokenAndReturnPayload(token){
    return jwt.verify(token, 'blastingoffagain');    
}

module.exports = {
    createJWT,
    verifyTokenAndReturnPayload
}
