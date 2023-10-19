const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const loginService = require('../service/loginService');

router.use(bodyParser.json());

// login endpoint
// POST {username, password}
router.post("/login", async (req, res) => {
    const {username, password} = req.body;

    const {success, result} = await loginService.login(username, password);
    if(!success){
        return res.status(400).send({
            message: "error logging in to Cognito",
            result
        });
    }

    return res.status(200).send({
        message: "Successful login to Cognito",
        result
    });
    
});

//might add error catch for wrong params 
//confirm endpoint may be optional with lambda presignup triggers
router.post("/confirm", async (req, res) => {
    const { username, confirmationCode } = req.body;

    const confirmedResponse = await loginService.confirm(username, confirmationCode);
    if(!confirmedResponse){
        return res.status(400).send({
            message: "error logging in to Cognito",
            confirmedResponse
        });
    }

    return res.status(200).send({
        message: "Successful login to Cognito",
        confirmedResponse
    });
})

module.exports = router;