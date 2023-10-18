
const registerDao = require('../repository/registerDao');
const profileDao = require('../repository/profileDAO');
//////////////////////////////////
async function addCognitoToDb(user_id, username){
    try {
        console.log("in service add cognito to db");
        console.log("user id ", user_id)
        console.log("username ",username);
        await registerDao.addCognitoToDb(user_id, username);
        console.log("added to db" );
        try {
            await profileDao.createProfile(user_id);
            console.log("added to profiles" );
            return user_id;
            
        } catch (error) {
            console.log("erorr trying to add to poke profiles");
            return null;
        }
    } catch (error) {
        console.error("error in registerService", error);
        return null;
    }
}


module.exports = {
    addCognitoToDb
}