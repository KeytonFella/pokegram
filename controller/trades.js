const express = require('express');
const router = express.Router();
const tradesService = require('../service/tradesService');
const tradesValidation = require('../utility/middleware/tradesMW.js');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

module.exports = router;

//add trade
router.post('', tradesValidation.verifyUser, async (req, res) => {
    const body = req.body;
    try{
        const data = await tradesService.submitTradeData(body.currentUserId, body.currentUsername, body.desire_list, body.surrender_list);
        if(data.bool){
            res.status(201).send({
                message: data.message
            })
        }else{
            res.status(400).send({
                message: data.message
            })
        }      
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.get('', tradesValidation.verifyUser, async (req, res) => {
    try{
        const data = await tradesService.findTrades(req.params.user)
        if(data.bool){
            res.send({
                message: data.message,
                trades: data.data
            })
        }else{
            res.status(400).send({
                error: data.message,
                // error: `${data.message}`
            })
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.put('desire-list', tradesValidation.verifyUser, async (req, res) => {
    const body = req.body;
    try{
        const data = await tradesService.updateDesireList(body.currentUserId, body.desire_list)
    }
})