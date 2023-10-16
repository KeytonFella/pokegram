const friendsDao = require('../repository/friendsDao');

//////////////////////////////////
async function getFriends(user_id){
    try {
        const list = await friendsDao.getFriends(user_id);
        console.log("list.Items[0]: ", list.Items[0]);
        return list.Items[0].friends;
    } catch (error) {
        console.error("error in friendsService", error);
        return null;
    }
}


module.exports = {
    getFriends
}