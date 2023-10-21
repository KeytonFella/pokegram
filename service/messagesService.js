const messagesDAO = require('../repository/messagesDAO');
const uuid = require('uuid');

module.exports = {
    getMessages,
    sendMessage,
    deleteMessage
}

async function getMessages(user_id){
    try{
        const messages = await messagesDAO.getMessages(user_id);

        return {bool: true, messages: messages.Item.messages};

    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function sendMessage(sender, recipient, message_text){
    try{
        const message = {
            message_id: uuid.v4(),
            sender_id: sender,
            recipient_id: recipient,
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