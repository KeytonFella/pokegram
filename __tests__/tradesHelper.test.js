const tradesHelper = require('../service/tradesHelper');

describe('Trades Helper', () => {
  
  let tradeData;
  beforeEach(() => {
    tradeData = [
      {
        user_id: 'Test1',
        username: 'D123S456',
        surrender_list: [ 4, 5, 6 ],
        desire_list: [ 1, 2, 3 ]
      },
      {
        user_id: 'Test2',
        username: 'D246S135',
        surrender_list: [ 1, 3, 5 ],
        desire_list: [ 2, 4, 6 ]
      }
  ];
  })
  
  it('should return an array of available trades when createTradesArray is successful', async () => {
    const currentUserGives = [1, 10, 100];
    const currentUserGets = [4, 40, 400];
    
    const expectedTrades = [
        {
            user_id: 'Test1',
            username: 'D123S456',
            give_pokemon: [1],
            get_pokemon: [4]
        }
    ]

    const result = tradesHelper.createTradesArray(tradeData, currentUserGives, currentUserGets);

    expect(result).toEqual(expectedTrades);
  });

  it('should return a blank array if there are no available trades', async () => {
    const currentUserGives = [10, 11, 100];
    const currentUserGets = [40, 44, 400];
    
    const expectedTrades = []

    const result = tradesHelper.createTradesArray(tradeData, currentUserGives, currentUserGets);

    expect(result).toEqual(expectedTrades);
  });

  // Clear mocks after each test
    afterEach(() => {
        jest.clearAllMocks();
    });
});