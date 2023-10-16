const express = require('express');
const app = express();
const port = 5500;
const cors = require('cors');
const bodyParser = require('body-parser');
const profileRouter = require('./controller/profileController');
const tradesRouter = require('./controller/tradesController');
const addressesRouter = require('./controller/addressesController');
const loginRegisterRouter = require('./controller/loginRegisterController');
const logger = require('./utility/middleware/logger');
const jwt = require('./utility/jwt_util')

app.use(cors());
app.use(bodyParser.json());
app.use(logger.logRequest);
app.get('/', (req, res) => {
    res.send('Hello! Welcome to the Pokegram API!');
    }
);
app.use('/', loginRegisterRouter)
//app.use(jwt.verifyUser);
app.use('/api/profiles', profileRouter);
app.use('/api/trades', tradesRouter);
app.use('/api/addresses', addressesRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);
