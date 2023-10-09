const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

function createJWT(user_id, username){
    return jwt.sign({
        user_id,
        username
    }, 'blastingoffagain', {
        expiresIn: '1d'
    })
}

jwt.verify = Promise.promisify(jwt.verify); // Turn jwt.verify into a function that returns a promise

// verify
function verifyTokenAndReturnPayload(token){
    return jwt.verify(token, 'blastingoffagain');    
}

function verifyUser(req, res, next){
    if(req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];
        verifyTokenAndReturnPayload(token)
            .then((payload) => {
                req.body.currentUserId = payload.user_id;
                req.body.currentUsername = payload.username;
                next();
            })
            .catch((err) => {
                res.statusCode = 401;
                res.send({
                    message: "Failed to Authenticate Token"
                })
            })
    }else{
        res.statusCode = 401;
        res.send({
            message: "User requires authorization. Please log in"
        })
    }
}

module.exports = {
    createJWT,
    verifyTokenAndReturnPayload,
    verifyUser
}
