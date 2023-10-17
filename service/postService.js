const PostDAO = require('../repository/postDAO');
const uuid = require('uuid');
async function addPost(user_id_fk, text_body, image_s3_id, tags){
    let post_id = uuid.v4()
    try{
        const data = await PostDAO.PostDAO(post_id, user_id_fk, text_body, image_s3_id, tags);
        return {bool: true, message: "Post Added Successfully", post_id: post_id};
    }catch(err){
        return {bool: false, message: `${err}`};
    }

}
async function addImage(image_buffer){
    let image_id = uuid.v4()
    try{
        const data = await PostDAO.PostImageDAO(image_id, image_buffer);
        return {bool: true, message: "Image Added Successfully", image_id: image_id};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}
async function getUsersPosts(user_id){
    try{
        const data = await PostDAO.getUsersPostsDAO(user_id);
        return {bool: true, message: "User Posts Successful", content: data};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}
function getImage(image_id){
   return PostDAO.getImageDAO(image_id)
}
module.exports = {
    addPost,
    addImage,
    getUsersPosts,
    getImage,
}