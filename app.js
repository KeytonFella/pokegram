const express = require('express');
const app = express();
const port = 5500;
const cors = require('cors');
const bodyParser = require('body-parser');
const profileRouter = require('./controller/profileController');
const tradesRouter = require('./controller/tradesController');
const registerRouter = require('./controller/registerController');
const loginRouter = require('./controller/loginController');
const addressesRouter = require('./controller/addressesController');
const postRouter = require('./controller/postController')
const logger = require('./utility/middleware/logger');
const jwt = require('./utility/jwt_util');
const jwks = require('./utility/jwks_util');

app.use(cors());
app.use(bodyParser.json());
app.use(logger.logRequest);
app.get('/', (req, res) => {
    res.send('Hello! Welcome to the Pokegram API!');
    }
);
//app.use('/', loginRegisterRouter)
//app.use(jwt.verifyUser);

app.use('/api/', registerRouter);
app.use('/api/', loginRouter);
app.get("/unprotected", (req, res) => {
    res.send({message: 'you accessed unprotected data! req.user should be empty', data: req.user});
})
app.use(jwks.verifyUserJWKS);
//protected
app.get("/protected", (req, res) => {
    res.send({message: 'you accessed protected data!', data: req.user});
})

app.use('/api/profiles', profileRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/addresses', addressesRouter);
app.use('/api/post', postRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);
