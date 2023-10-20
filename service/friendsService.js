const friendsDao = require('../repository/friendsDao');

//////////////////////////////////
async function getFriends(user_id) {
    try {  
        const list = await friendsDao.getFriends(user_id);
        //console.log("list.Items[0] = ", list.Items[0]);
        console.log("list is ", list );
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
        //console.log("friendResponse is", friendResponse);
        const friend = friendResponse.Items[0];
        if(!friend || friend === null){
            console.error("no user found with given id: ", friend_id);
            return null;
        }
        //console.log("friend is: ", friend);

        const friends = await getFriends(user_id);
        //check if list is null or empty
        //console.log("friends  is ", friends || null);
        if (!friends || friends.length === 0) {
            console.error('No list retrieved');
            return null;
          }
        ///check if friend we are adding exists in the users friends list 
        let friendIndex;
        try {
            friendIndex = friends.findIndex(f => f.user_id === friend_id);
            console.log("freind index is ", friendIndex);
            if (friendIndex !== -1) {
                console.error('Friend is already in the list');
                return null;
            }
        } catch (error) {
            console.error("error with friend index", friendIndex);
            return null;
        }
        //add friend to the friends list
        try {
            //console.log("going to add friend", user_id, friend.user_id, friend.username);
            const addedFriend = await friendsDao.addFriend(user_id, friend.user_id, friend.username);
            //console.log("addedFriend is ", addedFriend);
            return addedFriend?.Attributes?.friends;
        } catch (error) {
            console.error("error in adding friend ",error);
            return null;
        }
    } catch (error) {
        console.error("error finding friend in getUserById", error);
        return null;
    }
}

async function deleteFriend(user_id, friend_id){
    try {
        // Fetch the current friends list of the user
        const friends = await getFriends(user_id);
        
         //check if list is null or empty
        if (!friends || friends?.length === 0) {
            console.log('User does not have any friends');
            return null;
        }

        // Check if the friend to be removed exists in the list
        const friendIndex = friends.findIndex(f => f.user_id === friend_id);
        if (friendIndex === -1) {
            console.error('Friend not found in the list');
            return null;
        }

        // Remove the friend from the list
        friends.splice(friendIndex, 1);

        // delete the friend from the friends list in the users database
        try {
            const updatedFriends = await friendsDao.deleteFriend(user_id, friendIndex);
            console.log(updatedFriends);
            console.log(friends);
            //if lists do not match return null
            return updatedFriends ? updatedFriends.Attributes?.friends : null;
        } catch (error) {
            console.error('Error in deleteFriend trying to delete:', error);
        }

    } catch (error) {
        console.error('Error in deleteFriend trying to get list:', error);
        return null;
    }
}

module.exports = {
    getFriends, addFriend, deleteFriend
}