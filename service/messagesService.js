const messagesDAO = require('../repository/messagesDAO');
const uuid = require('uuid');

module.exports = {
    getMessages,
    sendMessage,
    deleteMessage,
    getIdByUsername,
    getUsernameById
}

async function getMessages(user_id){
    try{
        const messages = await messagesDAO.getMessages(user_id);

        return {bool: true, messages: messages.Item.messages};

    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function getUsernameById(user_id){
    try{
        const data = await messagesDAO.getUsernameById(user_id);
        const username = data.Item.username;
        return {bool: true, username: username};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function getIdByUsername(username){
    try{
        const data = await messagesDAO.getIdByUsername(username);
        if(data.Count > 0){
            const user_id = data.Items[0].user_id;
            return {bool: true, user_id: user_id};
        }else{
            return {bool: false, message: "user does not exist"}
        }
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function sendMessage(sender, recipient, message_text){
    try{
        let recipient_id = recipient;
        const data = await getIdByUsername(recipient);
        if(data.bool){
            recipient_id = data.user_id;
        }
        const message = {
            message_id: uuid.v4(),
            sender_id: sender,
            recipient_id: recipient_id,
            message_text: message_text
        }

        const dataSender = await messagesDAO.addMessage(sender, message)
        const dataRecipient = await messagesDAO.addMessage(recipient, message)

        return {bool: true, message: "message sent successfully"};

    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function deleteMessage(user_id, message_id){
    try{
        const currentMessages = await messagesDAO.getMessages(user_id);
        const messagesArray = currentMessages.Item.messages;
        
        let index = -1;
        for(let i = 0; i < messagesArray.length; i++){
            if(messagesArray[i].message_id === message_id){
                index = i;
            }
        }

        if(index === -1){
            return {bool: false, message: `No message with id: ${message_id}`}
        }

        const data = await messagesDAO.deleteMessage(user_id, index);
        return {bool: true, message: "Message deleted successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}