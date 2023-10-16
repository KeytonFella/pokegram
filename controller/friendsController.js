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
    //if no friends list was retrieved throw an error. Might change status  code
    if(friendsList === null){
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




/* if(req.body.currentUserId != req.params){
        return res.status(403).send({
            message: "Error, You are not allowed to view this users list"
        })
    } */
    
//////////////////////////this should be for a post or delete
 /* Compare the user.user_id friends list we are trying to 
        access with the user_id of the current logged in user
        already verified with middleware
    */
/*         if(req.params !== req.body.currentUserID)
        res.status(403);
        res.send({
            message: "You are not allowed to view another users friends list"
        })
 */

module.exports = router;