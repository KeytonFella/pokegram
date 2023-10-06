const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

const tradesRouter = require('./routes/trades');
app.use('/trades', tradesRouter);

app.use(cors());
app.use(bodyParser.json())
app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);