const friendsDao = require('../repository/friendsDao');

//////////////////////////////////
async function getFriends(user_id) {
    try {
       
        const list = await friendsDao.getFriends(user_id);
        //console.log("list.Items[0] = ", list.Items[0]);
        return list.Items[0].friends;
    } catch (error) {
        console.error("error in friendsService", error);
        return null;
    }
}



async function addFriend(user_id, friend_id) {
    try {
        //see if friend exists
        const friendResponse = await friendsDao.getUserById(friend_id);
        console.log("friendResponse is", friendResponse);
        const friend = friendResponse.Items[0];
        console.log("friend is: ", friend);

        const friends = await getFriends(user_id);
        console.log("friends  is ", friends);
        if (friends.length === 0) {
            console.log('User does not exist');
            return null;
          }

        //check if friend we are adding exists in the users friends list 
        try {
            if (friends.some(f => f.user_id === friend.user_id)) {
                console.error('Friend is already in the list');
                return null;
            }
        } catch (error) {
            console.log("error with mapping", error);
            return null
        }

        //add friend to the friends list
        try {
        //    console.log("going to add friend", user_id, friend.user_id, friend.username);
            const addedFriend = await friendsDao.addFriend(user_id, friend.user_id, friend.username);
            return addedFriend?.Atributes?.friends;
        } catch (error) {
            console.error(error);
            return null;
        }
    } catch (error) {
        console.error("error finding friend in addFriend", error);
        return null;
    }
}

async function deleteFriend(user_id, friend_id){
    
}

module.exports = {
    getFriends, addFriend
}