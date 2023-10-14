const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');
const profileRouter = require('./controller/profileController');
const tradesRouter = require('./controller/tradesController');
const loginRegisterRouter = require('./controller/loginRegisterController');
const logger = require('./utility/middleware/logger');
const jwt = require('./utility/jwt_util')

app.use(cors());
app.use(bodyParser.json());
app.use(logger.logRequest);
app.use('/', loginRegisterRouter)
app.use(jwt.verifyUser);
app.use('/api/profiles', profileRouter);
app.use('/api/trades', tradesRouter);
app.get('/', (req, res) => {
    res.send('Hello and welcome to the Pokegram API!');
    }
);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);
