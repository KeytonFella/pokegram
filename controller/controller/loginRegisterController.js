const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const myService = require('../service/loginRegisterService');
//const logger = require("../logger/logger.js");

router.use(bodyParser.json());

/* Post Account with a unique username and valid password  */
router.post('/register', async (req, res) => {
    const {username, password} = req.body;

    // service method to validate input
    // on success, return 200, with user info
    const userInfo = await myService.validateRegister(username, password);
    if(userInfo){
        console.log(userInfo);
        res.status(200);
        res.send({
            message: "Successfuly created account",
            username: userInfo.username,
        })
    }else{
        res.status(400);
        res.send({
            message: "Unsuccessful Account Creation"
        })
    }
})

// login endpoint
// POST {username, password}
router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    // service method to validate input
    // service method to call database
    // on success, return 200, with user info
    const userInfo = await myService.validateLogin(username, password);
    if(userInfo){
        console.log(userInfo);
        res.status(200);
        res.send({
            message: "Successful Login",
            username: userInfo.username,
        })
    }else{
        res.status(400);
        res.send({
            message: "Unsuccessful Login"
        })
    }
})

module.exports = router;