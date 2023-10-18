const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const region = 'us-east-2';
const userPoolId = "us-east-2_XJLFbeldD";



const client = jwksClient({
    jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
})

function getKey(header, callback) {
    client.getSigningKey(header.kid, function(err, key){
        if(err){
            console.error("Error at getSigningKey " + err);
            callback(err);
            return;
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    })
}

//when the callback finishes we get the decoded token
function verifyUserJWKS(req,res,next) {
    console.log("calling middleware");
    if(!(req.headers && req.headers.authorization)){
        return res.status(401).send({message: "No Authorization Headers"});
    }
    const token = req.headers.authorization.split(' ')[1]; // Bearer <token>

    jwt.verify(token, getKey, { algorithms: ['RS256']}, (err, decoded) => {
        if(err){
            console.error("error at jwt.verify" + err);
            return res.status(401).send({message: "invalid token"});
        }
        console.log("decoded: ", decoded);
        //set req properties from the decoded token
        req.user = decoded;
        req.body.currentUserId = decoded.sub;
        req.body.currentUsername = decoded.username;
        next();
    });
}

module.exports = {
    
    verifyUserJWKS
}
