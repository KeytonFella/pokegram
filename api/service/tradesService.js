const tradesDAO = require('../repository/tradesDAO');
const jwtUtil = require('../utility/jwt_util');

module.exports = {
    submitTradeData
}

async function submitTradeData(user_id, desire_list, surrender_list){
    try{
        const data = await tradesDAO.submitTradeData(user_id, desire_list, surrender_list);
        return {bool: true, message: "Trade data added successfully"};
    }catch(err){
        return {bool: false, message: `${err}`};
    }
}