
const registerDao = require('../repository/registerDao');
const profileDao = require('../repository/profileDAO');
//////////////////////////////////
async function addCognitoToDb(user_id, username){
    try {
        await registerDao.addCognitoToDb(user_id, username);
        await profileDao.createProfile(user_id);
        return user_id;
    } catch (error) {
        console.error("error in registerService", error);
        return null;
    }
}


module.exports = {
    addCognitoToDb
}