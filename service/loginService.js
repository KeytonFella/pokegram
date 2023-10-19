const cognito = require('../utility/aws/cognito');


// Function to add a user to the users_table in DynamoDB
async function login(username, password){
    try {
        // Attempt to login to Cognito
        const result = await cognito.login(username, password);
        return {success: true, result}; 
    } catch (error) {
        try{
            const errDetails = error.message.split(': ')[0];  // Split the message by ': '
            console.log("errDetails",errDetails);
            return {success: false, result: errDetails};
        } catch(splitError){
            return {success: false, result: null};  // Return false if there's an error
        }
    }
}


async function confirm(username, confirmationCode){
    try {
        const result = await cognito.confirm(username, confirmationCode);
        return {success: true, result}; 
    } catch (error) {
        console.error("error confirming", error);
        const parts = error.message.split(': ');  // Split the message by ': '
        if (parts.length > 1) {
            const errDetails = parts[1]; // Grab the second part of the string
            console.log("errDetails",errDetails);
            return {success: false, result: errDetails};
        } else{
            return {success: false, result: null};  // Return false if there's an error
        }
    }
}

module.exports = {login, confirm}