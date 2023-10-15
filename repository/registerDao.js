/* 
    personal database setup
*/
const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

const docClient = new AWS.DynamoDB.DocumentClient();


// ============================== DynamoDB Functions ==============================
const TABLENAME = 'users';

function addCognitoToDb(user_id, street_name="", city=" ", state=" ", zip=" "){
    console.log('in the dao function register');
    const params = {
        TableName: TABLENAME,
        ConditionExpression: 'attribute_not_exists(user_id)',
        Item: {
            user_id,
            address: {
                street_name,
                city,
                state,
                zip
            }
        }
    }
    return docClient.put(params).promise();
}

module.exports = {
    addCognitoToDb
}