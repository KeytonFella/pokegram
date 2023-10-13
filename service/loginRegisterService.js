const dao = require('../repository/loginRegisterDao');
const jwt_util = require('../utility/jwt_util.js');
const gen_id = require('../utility/gen_uuid.js');
//const logger = require("../logger/logger.js");

async function validateRegister(username, password, uuid){
/*     (                  # Start of group
        (?=.*\d)          # must contains one digit from 0-9
        (?=.*[a-z])       # must contains one lowercase characters
        (?=.*[\W])        # must contains at least one special character
        .                 # match anything with previous condition checking
        {8,20}            # length at least 8 characters and maximum of 20 
      )                   # End of group 
      ex. abc123!@#A
*/

    regex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{6,20})/;
    //use regex to test for password validation
    if(password && regex.test(password) && username){
        let uuid = gen_id();
        try {
            await dao.registerAccount(username, password, uuid);
        } catch (error) {
            console.error("error trying to create account: " + error);
            return null;
        }
        return {username};
    }else{
        return null;
    }
    // calls the dao create the account.
    //only try to access the Users password if not null 
}


async function validateLogin(username, password){
    if( !(username || password)){
        console.log("empty username or password");
        return null;
    }

    // calls the dao to check login
    try {
        const userData = await dao.retrieveByUsername(username);
        //only try to access the Users password if not null 
        if(userData?.Item?.password === password){
            user_id = userData.Item.user_id;
            let token = jwt_util.createJWT(user_id, username);
            return {username, user_id, token};
        }else{
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = {
    validateLogin, validateRegister
}