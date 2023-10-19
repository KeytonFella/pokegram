
  //personal database setup


const AWS = require('aws-sdk');

AWS.config.update({
    region: 'us-east-2'
});

docClient = new AWS.DynamoDB.DocumentClient();



// ============================== DynamoDB Functions ==============================
//local
/* const TABLENAME = 'users';
 */

const TABLENAME = 'users_table';


//function to add a user to DynamoDB from a cognito users sub and username
function addCognitoToDb(user_id, username, street_number="",  street_name="", city=" ", state=" ", zip=" "){
    const params = {
        TableName: TABLENAME,
        ConditionExpression: 'attribute_not_exists(user_id)',
        Item: {
            user_id,
            username,
            address: {
                street_number,
                street_name,
                city,
                state,
                zip
            },
            friends: [{
                user_id: "0ac11b24-e532-4d15-b36d-74d3e3d88dc3",
                username: "ash_ketchum"
              }]
        }
    };

    if (!docClient) {
        console.error('docClient is not initialized yet');
        return Promise.reject(new Error('docClient is not initialized'));
    }
   
    return docClient.put(params).promise();
}

// Function to delete a user from DynamoDB
function deleteUser(user_id) {
    const params = {
        TableName: TABLENAME,
        Key: {
            user_id
        },
        ReturnValues: 'ALL_OLD'
    };
    if (!docClient) {
        console.error('docClient is not initialized yet');
        return Promise.reject(new Error('docClient is not initialized'));
    }
    return docClient.delete(params).promise();
}

module.exports = {
    addCognitoToDb, deleteUser
}