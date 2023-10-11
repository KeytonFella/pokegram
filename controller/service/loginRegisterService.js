const dao = require('../daos/loginRegisterDao');
const util = require('../util/util.js');
const logger = require("../logger/logger.js");

async function validateRegister(username, password){
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
    if(password && regex.test(password)){
        try {
            await dao.registerAccount(username, password, util.genUUID);
        } catch (error) {
            logger.error("error trying to create account: " + error);
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
    // calls the dao to check login
    const userData = await dao.retrieveByUsername(username);
    //only try to access the Users password if not null 
    if(userData?.Item?.password === password){
        return {username};
    }else{
        return null;
    }
}


module.exports = {
    validateLogin, validateRegister
}