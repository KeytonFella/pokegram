module.exports = {
    createTradesArray
}

function createTradesArray(tradeData, currentUserGives, currentUserGets){
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

    return trades;
}