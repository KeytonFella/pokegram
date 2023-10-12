const express = require('express');
const app = express();
const port = 5500;
const cors = require('cors');
const bodyParser = require('body-parser');
const profileRouter = require('./controller/profileController');
const tradesRouter = require('./controller/tradesController');
const logger = require('./utility/middleware/logger');
const jwt = require('./utility/jwt_util')

app.use(cors());
app.use(bodyParser.json());
app.use(logger.logRequest);
app.get('/', (req, res) => {
    res.send('Hello! Welcome to the Pokegram API!');
    }
);
//app.use(login register router goes here)
app.use(jwt.verifyUser);
app.use('/api/profiles', profileRouter);
app.use('/api/trades', tradesRouter);

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);
