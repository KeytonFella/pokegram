const express = require('express');
const app = express();
const port = 5500;
const cors = require('cors');
const bodyParser = require('body-parser');

const teamRouter = require('./controller/teamController.js')
const AWS = require('aws-sdk')

const profileRouter = require('./controller/profileController');
const tradesRouter = require('./controller/tradesController');
/* const profileRouter = require('./controller/profileController');
const tradesRouter = require('./controller/tradesController'); */
const loginRegisterRouter = require('./controller/loginRegisterController');
const logger = require('./utility/middleware/logger');
const jwt = require('./utility/jwt_util')


app.use(cors());
app.use(bodyParser.json());
app.use(logger.logRequest);
//app.use(login register router goes here)
//app.use(jwt.verifyUser);
app.use('/api/profiles', profileRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/teams', teamRouter);

/* app.use('/api/profiles', profileRouter);
app.use('/api/trades', tradesRouter); */
app.use('/', loginRegisterRouter)
app.get('/', (req, res) => {
    res.send('Hello and welcome to the Pokegram API!');
    }
);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);
