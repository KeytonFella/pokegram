const express = require('express');
const app = express();
const port = 3000;
const cors = require('cors');
const bodyParser = require('body-parser');

const teamRouter = require('./controller/teamController.js')
const AWS = require('aws-sdk')

const profileRouter = require('./controller/profileController');

app.use(cors());
app.use(bodyParser.json())
app.use('/api/profiles', profileRouter);

app.get('/', (req, res) => {
    res.send('Hello and welcome to the Pokegram API!');
    }
);

const dynamoDB = new AWS.DynamoDB()

dynamoDB.listTables({}, (err, data) => {
    if(err) {
        console.error('Error', err);
    }else{
        console.log('Tables:', data.TableNames);
        console.log('Full Data: ', data);
        
    }
});

app.use(teamRouter);



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    }  
);
