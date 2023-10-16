const tradesDAO = require('../repository/tradesDAO');
//const jwtUtil = require('../utility/middleware/jwks_util');

module.exports = {
    submitTradeData,
    findTrades,
    updateDesireList,
    updateSurrenderList
}

async function submitTradeData(user_id, username, desire_list, surrender_list){    
    try{
        const data = await tradesDAO.submitTradeData(user_id, username, desire_list, surrender_list);
        return {bool: true, message: "Trade data added successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function updateDesireList(user_id, new_desire_list){
    try{
        const data = await tradesDAO.updateDesireList(user_id, new_desire_list);
        return {bool: true, message: "Trade data updated successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}

async function updateSurrenderList(user_id, new_surrender_list){
    try{
        const data = await tradesDAO.updateSurrenderList(user_id, new_surrender_list);
        return {bool: true, message: "Trade data updated successfully"};
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

        let trades = [];

        for(otherUser of tradeData){
            otherUser_id = otherUser.user_id;
            otherUsername = otherUser.username
            giveList = [];
            getList = [];

            for(getPokemon of currentUserGets){
                if(otherUser.surrender_list.includes(getPokemon)){
                    getList.push(getPokemon)
                }
            }

            for(givePokemon of currentUserGives){
                if(otherUser.desire_list.includes(givePokemon)){
                    giveList.push(givePokemon)
                }
            }

            if(giveList.length > 0 && getList.length > 0){
                trades.push({
                    user_id : otherUser_id,
                    username : otherUsername,
                    give_pokemon : giveList,
                    get_pokemon: getList
                })
            }
        }

        if(trades.length > 0){
            return {bool: true, message: "Here are your available trades", data: trades};
        }

        return {bool: false, message: "You have no available trades"};

    }catch(err){
        console.error(err);
        return {bool: false, message: `${err}`};
    }
}
