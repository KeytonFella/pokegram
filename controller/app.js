const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const loginRegisterController = require('./controller/loginRegisterController');

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);

app.use('/api/v1/', loginRegisterController);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);