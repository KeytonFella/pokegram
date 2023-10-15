const service = require('../service/loginRegisterService');
const dao = require('../repository/loginRegisterDao');

jest.mock('../repository/loginRegisterDao');

describe('validateRegister', () => {
  it('should validate and create a new user when regex.test(password) is truthy', async () => {
    dao.registerAccount.mockResolvedValue(true);

    const result = await service.validateRegister('testuser', '123ABCabc!@#');
    expect(result).toEqual({ username: 'testuser' });
    // ... more tests
  });

  it('should reject an invalid password', async () => {
    const result = await service.validateRegister('testuser', 'invalidpassword');
    expect(result).toBeNull();
  });

  it('should handle empty username or password', async () => {
    const result = await service.validateRegister('', '');
    expect(result).toBeNull();
  });

  it('should handle DAO errors', async () => {
    dao.registerAccount.mockRejectedValue(new Error('DAO error'));

    const result = await service.validateRegister('testuser', 'Valid ABCabc1!!');
    expect(result).toBeNull();
  });



});

describe('validateLogin', () => {
    it('should validate a correct login', async () => {
      dao.retrieveByUsername.mockResolvedValue({
        Item: { username: 'testuser', password: 'ABCabc1!' }
      });
  
      const result = await service.validateLogin('testuser', 'ABCabc1!');
      expect(result).toEqual(expect.objectContaining({ username: 'testuser' }));
    });
  
    it('should reject an incorrect login', async () => {
      dao.retrieveByUsername.mockResolvedValue({
        Item: { username: 'testuser', password: 'ABCabc1!' }
      });
  
      const result = await service.validateLogin('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  
    it('should handle DAO errors during login', async () => {
      dao.retrieveByUsername.mockRejectedValue(new Error('DAO error'));
  
      const result = await service.validateLogin('testuser', 'ABCabc1!');
      expect(result).toBeNull();
    });
  });