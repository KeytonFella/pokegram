const { addCognitoToUsersDb } = require('../service/registerService'); 
const registerDao = require('../repository/registerDao'); 
const cognito = require('../utility/aws/cognito'); 

jest.mock('../repository/registerDao'); // Mock the registerDao
jest.mock('../utility/aws/cognito'); // Mock the cognito utility

describe('addCognitoToUsersDb Function Testing', () => {

  // Clear all mock instances between tests to ensure that mock implementations do not interfere with each other
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns true when user is added successfully to the database', async () => {
    // Mock successful addition of user to DynamoDB
    registerDao.addCognitoToDb.mockResolvedValue();

    // Call the function and check the return value
    const result = await addCognitoToUsersDb("123", "username");
    expect(result).toEqual(true);

    // Check if the mock DAO function was called with the correct parameters
    expect(registerDao.addCognitoToDb).toHaveBeenCalledWith("123", "username");
  });

  it('returns false and deletes user from Cognito when there is a database error', async () => {
    // Mock failure of addition to DynamoDB
    registerDao.addCognitoToDb.mockRejectedValue(new Error("DB Error"));

    // Mock successful deletion from Cognito
    cognito.deleteUser.mockResolvedValue();

    // Call the function and check the return value
    const result = await addCognitoToUsersDb("123", "username");
    expect(result).toEqual(false);

    // Check if the mock DAO function was called with the correct parameters
    expect(registerDao.addCognitoToDb).toHaveBeenCalledWith("123", "username");

    // Check if the mock Cognito deleteUser function was called with the correct username
    expect(cognito.deleteUser).toHaveBeenCalledWith("username");
  });

  it('returns false when there is a database error and fails to delete user from Cognito', async () => {
    // Mock failure of addition to DynamoDB
    registerDao.addCognitoToDb.mockRejectedValue(new Error("DB Error"));

    // Mock failure of deletion from Cognito
    cognito.deleteUser.mockRejectedValue(new Error("Cognito Deletion Error"));

    // Call the function and check the return value
    const result = await addCognitoToUsersDb("123", "username");
    expect(result).toEqual(false);

    // Check if the mock DAO function was called with the correct parameters
    expect(registerDao.addCognitoToDb).toHaveBeenCalledWith("123", "username");

    // Check if the mock Cognito deleteUser function was called with the correct username
    expect(cognito.deleteUser).toHaveBeenCalledWith("username");
  });

  it('returns false when user_id or username is null', async () => {
    // Mock any potential database call to resolve (should not be reached)
    registerDao.addCognitoToDb.mockResolvedValue();

    // Test with user_id being null
    let result = await addCognitoToUsersDb(null, "username");
    expect(result).toEqual(false);

    // Test with username being null
    result = await addCognitoToUsersDb("123", null);
    expect(result).toEqual(false);

    // Test with both being null
    result = await addCognitoToUsersDb(null, null);
    expect(result).toEqual(false);

    // Check if the mock DAO function was never called
    expect(registerDao.addCognitoToDb).not.toHaveBeenCalled();
  });

  it('returns false when user_id or username is an empty string', async () => {
    // Mock any potential database call to resolve (should not be reached)
    registerDao.addCognitoToDb.mockResolvedValue();

    // Test with user_id being an empty string
    let result = await addCognitoToUsersDb("", "username");
    expect(result).toEqual(false);

    // Test with username being an empty string
    result = await addCognitoToUsersDb("123", "");
    expect(result).toEqual(false);

    // Test with both being empty strings
    result = await addCognitoToUsersDb("", "");
    expect(result).toEqual(false);

    // Check if the mock DAO function was never called
    expect(registerDao.addCognitoToDb).not.toHaveBeenCalled();
  });






});
