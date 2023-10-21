const express = require('express');
const router = express.Router();
const messagesService = require('../service/messagesService');
const axios = require('axios');

module.exports = router;

router.get('', async (req, res) => {
    try{
        const data = await messagesService.getMessages(req.body.currentUserId)
        if(data.bool){
            res.send({
                messages: data.messages
            })
        }else{
            res.status(400).send({
                message: data.message,
            });
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.get('/user_id', async (req, res) => {
    try{
        const data = await messagesService.getIdByUsername(req.body.username);
        if(data.bool){
            res.send({
                user_id: data.user_id
            })
        }else{
            res.status(400).send({
                message: data.message,
            });
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.put('', async (req, res) => {
    try{
        const data = await messagesService.sendMessage(req.body.currentUserId, req.body.recipient_id, req.body.message_text);
        if(data.bool){
            res.send({
                message: data.message
            })
        }else{
            res.status(400).send({
                message: data.message,
            });
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.delete('/:message_id', async (req, res) => {
    try {
        const data = await messagesService.deleteMessage(req.body.currentUserId, req.params.message_id);
        if(data.bool){
            res.send({
                message: data.message
            })
        }else{
            res.status(400).send({
                message: data.message,
            });
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})