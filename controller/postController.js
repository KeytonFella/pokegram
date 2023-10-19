const express = require('express');
const multer = require('multer');
const postService = require('../service/postService');
const postRouter = express.Router();
const upload = multer();

postRouter.post('/', async (req, res) => {
    const body = req.body;
    try{
        const data = await postService.addPost(body.current_userID, body.text_body, body.image_s3_id, body.tags);
        if(data.bool){
            res.status(201).send({
                message: data.message,
                post_id: data.post_id
            })
        }else{
            res.status(400).send({
                message: data.message
            })
        }      
    }
    catch(err) {
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        });
    }
});
// Upload Photo
postRouter.post('/image', upload.single('image'), (req, res) => {
    const image = req.file;
    postService.addImage(image).then((data) => { 
        if(data.bool) {     
            res.status(201).send({
                image_id: data.image_id
            })
        } else {
            res.status(400).send({
                message: data.message
            })
        }      
    }).catch((err) => {
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        });
    });
});
    
postRouter.get('/user', async (req, res) => {
    const user_id = String(req.query.user_id);
    try{
        const data = await postService.getUsersPosts(user_id);
        if(data.bool){
            res.status(201).send({
                data: data.content.Items
            })
        }else{
            res.status(400).send({
                message: data.message
            })
        }      
    }
    catch(err) {
        res.status(500).send({
            message: 'An error occurred',
            error: `${err}`
        });
    }
});
postRouter.get('/image', (req, res) => { //not async because of the nature of readpiplines. there might be complications later on tho. we'll note it
    const key = String(req.query.image_id);
    const readStream = postService.getImage(key);
    readStream.pipe(res);
});



module.exports = postRouter;
