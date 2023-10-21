const tradesDAO = require('../repository/tradesDAO');
const tradesHelper = require('./tradesHelper');

module.exports = {
    findTrades,
    addDesireList,
    addSurrenderList,
    removeDesireList,
    removeSurrenderList,
    retrieveTradeDataByUser,
    makeTradeOffer
}

async function addDesireList(user_id, pokemon){
    try{
        const data = await tradesDAO.addDesireList(user_id, pokemon);
        return {bool: true, message: "Trade data updated successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function addSurrenderList(user_id, pokemon){
    try{
        const data = await tradesDAO.addSurrenderList(user_id, pokemon);
        return {bool: true, message: "Trade data updated successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function removeDesireList(user_id, pokemon){
    try{
        const currentUserData = await tradesDAO.retrieveTradeDataByUser(user_id);
        const index = currentUserData.Item.desire_list.indexOf(pokemon);
        const data = await tradesDAO.removeDesireList(user_id, index);
        return {bool: true, message: "Trade data updated successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function removeSurrenderList(user_id, pokemon){
    try{
        const currentUserData = await tradesDAO.retrieveTradeDataByUser(user_id);
        const index = currentUserData.Item.surrender_list.indexOf(pokemon);
        const data = await tradesDAO.removeSurrenderList(user_id, index);
        return {bool: true, message: "Trade data updated successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function retrieveTradeDataByUser(user_id){
    try{
        const currentUserData = await tradesDAO.retrieveTradeDataByUser(user_id);
        return {bool: true, message: "Here is your trade data", data: currentUserData};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function findTrades(user_id){
    try{
        const currentUserData = await tradesDAO.retrieveTradeDataByUser(user_id);
        if(!currentUserData.Item){
            return {bool: false, message: `Could not retrieve trade information for user ${user_id}`};
        }

        const currentUserGets = currentUserData.Item.desire_list;
        const currentUserGives = currentUserData.Item.surrender_list;

        const allTradeData = await tradesDAO.retrieveAllTradeData();
        if(allTradeData.Count < 1){
            return  {bool: false, message: "There is no valid trade data"};
        }
        const tradeData = allTradeData.Items;

        const trades = tradesHelper.createTradesArray(tradeData, currentUserGives, currentUserGets); 

        if(trades.length > 0){
            return {bool: true, message: "Here are your available trades", data: trades};
        }

        return {bool: false, message: "You have no available trades"};

    }catch(err){
        console.error(err);
        return {bool: false, message: `${err}`};
    }
}

async function makeTradeOffer(otherUserId, trade_offer){
    try {
        const offerdata = tradesDAO.addTradeOffer(otherUserId, trade_offer);
        return {bool: true, message: "Trade offer made successfully"};
    }catch(err){
        console.error(err);
        return {bool: false, message: `${err}`};
    }
}


