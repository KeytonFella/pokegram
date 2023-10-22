const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const friendsService = require('../service/friendsService.js');

//const logger = require("../logger/logger.js");

router.use(bodyParser.json());


/* Get a users friends list but only if they are logged in   */
router.get('/:user_id/friends', async (req, res) => {

    console.log(req.params.user_id);   
    //will return friends list or null
    const friendsList = await friendsService.getFriends(req.params.user_id);
    console.log("controller firends list", friendsList);
    //if no friends list was retrieved throw an error. Might change status  code
    if(!friendsList){
        return res.status(404).send({
            message: "No list was retrieved"
        })
    } else{
        return res.status(200).send({
            message: "List succussfully grabbed",
            friendsList
        })
    }
});



/* add friends to list by id */
router.put('/:user_id/friends', async (req, res) => {
    //Our Current user as given by the decoded bearer token
    const user = {id: req.body.currentUserId, username: req.body.currentUsername};
    //The friend_key which can be user_id or username, and spcecify which one to use
    const friendAction = {friend_key: req.body.friend_key, key_type: req.body.key_type};

    //If there is no friend_key or key_type in the body then return error
    if(friendAction.friend_key === undefined || friendAction.key_type === undefined){
        return res.status(400).send({
            message: "friend_key and key_type must be in the body"
        })
    };
     //if key_type is not username or user_id then return error
     if(friendAction.key_type !== 'username' && friendAction.key_type !== 'user_id'){
        return res.status(400).send({
            message: "key_type invalid. Must be username or user_id"
        })
    }
    //returns 0 is results are same (abc === ABC)
    const isEqualUsername = user.username.localeCompare(friendAction.friend_key, undefined, { sensitivity: 'base' });
    const isEqualUserId = user.id.localeCompare(friendAction.friend_key, undefined, { sensitivity: 'base' });

    //if the CurrentUserId is the same as the user_id in the params then allow operation
    if (user.id === req.params.user_id) {
        
        //if trying to add same id or username as user then deny operation
        if(isEqualUserId === 0 || isEqualUsername === 0){
            return res.status(403).send({
                message: "You can't add yourself to your friends list"
            })
        }
        //set the friend_key to lowercase so we can search it in the db
        try {
            friendAction.friend_key = friendAction.friend_key.toLowerCase();
        } catch (error) {
            return res.status(404).send({
                message: "No Friend was added"
            });
        }
        //check friend exists, check user's freinds list, add if not in list alreaady 
        const friendResponse = await friendsService.addFriend(user.id, friendAction.friend_key, friendAction.key_type);

        //if no list returned
        if(!friendResponse || friendResponse.length === 0){
            return res.status(404).send({
                message: "No Friend was added"
            });
        } else {
            //console.log("updated friends", friendResponse);
            return res.status(201).send({
            message: "Friend was added!",
            friendsList: friendResponse
        })}
    }else{
        return res.status(403).send({
            message: "You are not allowed to edit other users friends"
        })
    }

})

//delete a friend to the friend list 
router.delete('/:user_id/friends', async (req,res) => {
    //Our Current user as given by the decoded bearer token
    const user = {id: req.body.currentUserId, username: req.body.currentUsername};
    console.log(req.body.currentUsername);
    console.log(user);
    //The friend_key which can be user_id or username, and spcecify which one to use with key_type
    const friendAction = {friend_key: req.body.friend_key, key_type: req.body.key_type};
    console.log(friendAction);
    //If there is no friend_key or key_type in the body then return error
    if(friendAction.friend_key === undefined || friendAction.key_type === undefined){
        return res.status(400).send({
            message: "friend_key and key_type must be in the body"
        })
    };
    if(friendAction.key_type !== 'username' && friendAction.key_type !== 'user_id'){
        return res.status(400).send({
            message: "key_type invalid. Must be username or user_id"
        })
    }
    if(friendAction.friend_key === "ash_ketchum" || friendAction.friend_key==="0ac11b24-e532-4d15-b36d-74d3e3d88dc3"){
        return res.status(403).send({
            message: "Sorry, You can't delete Ash :)"
        })
    }


    //if current user != :user_id deny operation
    //Only edit your own list 
    if (user.id !== req.params.user_id) {
        return res.status(403).send({
            message: "You are not allowed to edit other users friends"
        })
    }
    //returns 0 is results are same (abc === ABC)
    console.log(user.username, friendAction.friend_key);
    const isEqualUsername = user.username.localeCompare(friendAction.friend_key, undefined, { sensitivity: 'base' });
    const isEqualUserId = user.id.localeCompare(friendAction.friend_key, undefined, { sensitivity: 'base' });

    //if trying to delete same id or username as user then deny operation
    if(isEqualUserId === 0 || isEqualUsername === 0){
        return res.status(403).send({
            message: "You can't delete yourself to your friends list"
        })
    } 

    try {
        friendAction.friend_key = friendAction.friend_key.toLowerCase();
    } catch (error) {
        return res.status(404).send({
            message: "No Friend was added"
        });
    }

    //call the delete friend service method, will return deletedFriend object or null
    const deletedResponse = await friendsService.deleteFriend(user.id, friendAction.friend_key, friendAction.key_type);
    console.log("deletedResponse", deletedResponse);
    if(!deletedResponse){
        return res.status(403).send({
            message: ` Error removing friend from list`
        })
    }
    //return deleted friend if successful
    if(deletedResponse){
        return res.status(200).send({
            message: ` Friend was deleted from list`,
            friendsList: deletedResponse
        })
    }

    return res.status(469).send({
        message: "Error, something went wrong"
    })
})


module.exports = router;