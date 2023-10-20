const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const friendsService = require('../service/friendsService.js');

//const logger = require("../logger/logger.js");

router.use(bodyParser.json());


/* Get a users friends list but only if they are logged in   */
router.get('/:user_id/friends', async (req, res) => {
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
    const user = {id: req.body.currentUserId, username: req.body.currentUserame};
    //The friend_key which can be user_id or username, and spcecify which one to use
    const friendAction = {friend_key: req.body.friend_key, key_type: req.body.key_type};
    console.log("friendAction", friendAction.friend_key, friendAction.key_type);
    console.log(friendAction.key_type !== 'username');
    if(friendAction.key_type !== 'username' && friendAction.key_type !== 'user_id'){
        return res.status(400).send({
            message: "key_type invalid. Must be username or user_id"
        })
    }
    //check friend exists, check user's freinds list, add if not in list alreaady 
    //Only edit your own list
    if (user.id === req.params.user_id) {
        //if same id or username as user deny
        if(req?.body?.friend_key === user.id || req.body?.friend_key === user.username  ){
            return res.status(403).send({
                message: "You can't add yourself to your friends list"
            })
        }

        const friendResponse = await friendsService.addFriend(user.id, friendAction.friend_key, friendAction.key_type);
        //console.log("response", friendResponse);
        //if no list returned
        if(!friendResponse || friendResponse.length === 0){
            return res.status(404).send({
                message: "No Friend was added"
            });
        } else {
            //console.log("updated friends", friendResponse);
            return res.status(201).send({
            message: "Friend was added!",
            friendResponse
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
    const user = {id: req.body.currentUserId, username: req.body.currentUserame};
    //The friend_key which can be user_id or username, and spcecify which one to use
    const friendAction = {friend_key: req.body.friend_key, key_type: req.body.key_type};
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
    //if trying to delete same id or username as user then deny operation
    if(friendAction.friend_key === user.id || friendAction.friend_key === user.username ){
        return res.status(403).send({
            message: "You can't delete yourself to your friends list"
        })
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
            updated_friends: deletedResponse
        })
    }

    return res.status(469).send({
        message: "Error, something went wrong"
    })
})


module.exports = router;