const tradesHelper = require('../service/tradesHelper');
const tradesDAO = require('../repository/tradesDAO');
const tradesService = require('../service/tradesService');

describe('Trades Service', () => {
    const userTradeData = {
        Item: {
          user_id: '1',
          username: 'Test',
          surrender_list: [ 1, 3, 5 ],
          desire_list: [ 2, 4, 6 ]
        }
      };

    const allTradeData = {
        Items: [
          {
            user_id: 'Test1',
            username: 'D123S456',
            surrender_list: [4, 5, 6],
            desire_list: [1, 2, 3]
          },
          {
            user_id: 'Test2',
            username: 'D246S135',
            surrender_list: [1, 3, 5],
            desire_list: [2, 4, 6]
          }
        ],
        Count: 2,
        ScannedCount: 2
      }
      
    
    it('tradesHelper should return mocked array', () => {
        const spy = jest.spyOn(tradesHelper, 'createTradesArray').mockReturnValue([1, 2]);
        const isCalled = tradesHelper.createTradesArray();

        expect(spy).toHaveBeenCalled();
        expect(isCalled).toEqual([1, 2]);
    })

    it('tradesDAO should return mocked values', () => {
        const spyUserData = jest.spyOn(tradesDAO, 'retrieveTradeDataByUser').mockReturnValue(userTradeData);
        const isCalledUserData = tradesDAO.retrieveTradeDataByUser();

        const spyAllData = jest.spyOn(tradesDAO, 'retrieveAllTradeData').mockReturnValue(allTradeData);
        const isCalledAllData = tradesDAO.retrieveAllTradeData();

        expect(spyUserData).toHaveBeenCalled();
        expect(isCalledUserData).toEqual({
            Item: {
              user_id: '1',
              username: 'Test',
              surrender_list: [ 1, 3, 5 ],
              desire_list: [ 2, 4, 6 ]
            }
          });

        expect(spyAllData).toHaveBeenCalled();
        expect(isCalledAllData).toEqual({
            Items: [
              {
                user_id: 'Test1',
                username: 'D123S456',
                surrender_list: [4, 5, 6],
                desire_list: [1, 2, 3]
              },
              {
                user_id: 'Test2',
                username: 'D246S135',
                surrender_list: [1, 3, 5],
                desire_list: [2, 4, 6]
              }
            ],
            Count: 2,
            ScannedCount: 2
          });
    })

    it('findTrades should call retrieveTradeDataByUser, retrieveAllTradeData, and createTradesArray and return correct trades', async () => {
        const user_id = 1;
        const currentUserGets = [2, 4, 6];
        const currentUserGives = [1, 3, 5];
        const tradeData = [
            {
              user_id: 'Test1',
              username: 'D123S456',
              surrender_list: [4, 5, 6],
              desire_list: [1, 2, 3]
            },
            {
              user_id: 'Test2',
              username: 'D246S135',
              surrender_list: [1, 3, 5],
              desire_list: [2, 4, 6]
            }
          ]

        const spyCreateTradesArray = jest.spyOn(tradesHelper, 'createTradesArray').mockReturnValue([
            {
                "user_id": "Test2",
                "username": "D123S456",
                "give_pokemon": [
                    1,
                    3
                ],
                "get_pokemon": [
                    4,
                    6
                ]
            }
        ]);
        const spyUserData = jest.spyOn(tradesDAO, 'retrieveTradeDataByUser').mockReturnValue(userTradeData);
        const spyAllData = jest.spyOn(tradesDAO, 'retrieveAllTradeData').mockReturnValue(allTradeData);

        const result = await tradesService.findTrades(user_id);

        expect(spyCreateTradesArray).toHaveBeenCalledWith(tradeData, currentUserGives, currentUserGets);
        expect(spyUserData).toHaveBeenCalledWith(user_id);
        expect(spyAllData).toHaveBeenCalled;

        expect(result).toEqual({
            bool: true,
            message: "Here are your available trades",
            data: [
                {
                    "user_id": "Test2",
                    "username": "D123S456",
                    "give_pokemon": [
                        1,
                        3
                    ],
                    "get_pokemon": [
                        4,
                        6
                    ]
                }
            ]
        })
    })
});