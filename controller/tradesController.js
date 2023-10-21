const express = require('express');
const router = express.Router();
const tradesService = require('../service/tradesService');
const axios = require('axios');

module.exports = router;

async function validatePokemon(req, res, next){
    try{
        const data = await axios.get(`https://pokeapi.co/api/v2/pokemon/${req.body.pokemon.toLowerCase()}`)
        req.body.pokemon_id = data.data.id;
        next();
    }catch(err){
        res.status(400).send({
            message: "Not a valid pokemon"
        })
    }
}

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

router.get('', async (req, res) => {
    try{
        const data = await tradesService.findTrades(req.body.currentUserId)
        if(data.bool){
            res.send({
                message: data.message,
                trades: data.data
            })
        }else{
            res.status(200).send({
                message: data.message,
                trades: []
            });
        }
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.get('/data', async (req, res) => {
    try{
        const data = await tradesService.retrieveTradeDataByUser(req.body.currentUserId)
        if(data.bool){
            res.send({
                trades: data.data.Item
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

router.put('/desire-list', validatePokemon, async (req, res) => {
    const body = req.body;
    try{
        if(body.action === "remove"){
            const data = await tradesService.removeDesireList(body.currentUserId, body.pokemon_id)
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
        }
        if(body.action === "add"){
            const data = await tradesService.addDesireList(body.currentUserId, body.pokemon_id)
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
        }    
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.put('/surrender-list', validatePokemon, async (req, res) => {
    const body = req.body;
    try{
        if(body.action === "remove"){
            const data = await tradesService.removeSurrenderList(body.currentUserId, body.pokemon_id)
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
        }
        if(body.action === "add"){
            const data = await tradesService.addSurrenderList(body.currentUserId, body.pokemon_id)
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
        }    
    }catch(err){
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        })
    }
})

router.post('/offers', async (req, res) => {
    try{
        const data = await tradesService.makeTradeOffer(req.body.otherUserId, req.body.offer)
        if(data.bool){
            res.send({
                message: data.message,
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