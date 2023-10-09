const jwtUtil = require('../jwt_util');

module.exports = {
    verifyUser
}

function verifyUser(req, res, next){
    if(req.headers.authorization){
        const token = req.headers.authorization.split(' ')[1];
        jwtUtil.verifyTokenAndReturnPayload(token)
            .then((payload) => {
                req.body.currentUserId = payload.user_id;
                req.body.currentUsername = payload.username;
                next();
            })
            .catch((err) => {
                logger.error(`An error occurred when authenticating token: \n${err}`);
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