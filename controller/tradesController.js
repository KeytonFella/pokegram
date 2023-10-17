const express = require('express');
const router = express.Router();
const tradesService = require('../service/tradesService');

module.exports = router;

//add trade
router.post('', async (req, res) => {
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

router.get('list', async (req, res) => {
    try{
        const data = await tradesService.retrieveTradeDataByUser(req.body.currentUserId)
        if(data.bool){
            res.send({
                message: data.message,
                data: data.data
            })
        }else{
            res.status(400).send({
                error: data.message,
            });
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.get('', async (req, res) => {
    try{
        const data = await tradesService.findTrades(req.body.currentUserId)
        if(data.bool){
            res.send({
                message: data.message,
                trades: data.data
            })
        }else{
            res.status(400).send({
                error: data.message,
            });
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.put('desire-list', async (req, res) => {
    const body = req.body;
    try{
        const data = await tradesService.updateDesireList(body.currentUserId, body.desire_list)
        if(data.bool){
            res.send({
                message: data.message,
                trades: data.data
            })
        }else{
            res.status(400).send({
                error: data.message,
            })
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.put('surrender-list', async (req, res) => {
    const body = req.body;
    try{
        const data = await tradesService.updateSurrenderList(body.currentUserId, body.surrender_list)
        if(data.bool){
            res.send({
                message: data.message,
                trades: data.data
            })
        }else{
            res.status(400).send({
                error: data.message,
            })
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})
