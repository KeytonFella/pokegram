
const registerDao = require('../repository/registerDao');

//////////////////////////////////
async function addCognitoToDb(user_id, username){
    try {
        await registerDao.addCognitoToDb(user_id, username);
        return user_id;
    } catch (error) {
        console.error("error in registerService", error);
        return null;
    }
}


module.exports = {
    addCognitoToDb
}