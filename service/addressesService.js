const addressesDAO = require('../repository/addressesDAO');
const axios = require('axios');

const { SecretsManagerClient, GetSecretValueCommand} = require("@aws-sdk/client-secrets-manager");
  
const secret_name = "prod/GG/key";
const client = new SecretsManagerClient({region: "us-east-2"});
let response;
try {
    response = client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
      ).then((data) => {
            response = data;
        }).catch((err) => { console.log(err) });
      console.log(response)
  } catch (error) {
      throw error;
  }
const API_KEY = response.SecretString;
const GOOGLE_MAPS_API = 'https://maps.googleapis.com/maps/api/geocode/json?address='

// ============================== Geocoding Service Calls ==============================
// Get address from user_id
function getAddress(user_id){
    logger.info('getAddress service called');
    return new Promise((resolve, reject) => {
        addressesDAO.getAddress(user_id).then((data) => {
            logger.info('getAddress resolved')
            let geoAddress = formatAddress(data.Item.address);
            axios.get(`${GOOGLE_MAPS_API}${geoAddress}${API_KEY}`).then((res) => {
                logger.info('Google Maps API call successful')
                resolve(res.data.results[0].geometry.location);
            }).catch((err) => {
                logger.error(`Error attempting to call Google Maps API: ${err}`)
                reject(err);
            });
        }).catch((err) => {
            logger.error(`Error attempting to getAddress: ${err}`)
            reject(err);
        });
    });
}

// Get all addresses in the same state
 function getAllAddresses(user_id){
    logger.info('getAllAddresses service called');
    return new Promise((resolve, reject) => {
        addressesDAO.getAllAddresses().then((data) => {
            logger.info('getAllAddresses resolved')
            // Create list of requests to wait to resolve them until all are done
            const requests = [];
            // Create list for users to be stored in as they are resolved
            let users = [];
            for(let i = 0; i < data.Items.length; i++){
                if(data.Items[i].user_id == user_id){
                    data.Items.splice(i, 1);
                }
                // Format address for geocoding
                let geoAddress = formatAddress(data.Items[i].address);
                // Create request to Google Maps API
                const request = axios.get(`${GOOGLE_MAPS_API}${geoAddress}${API_KEY}`).then((res) => {
                    logger.info('Google Maps API call successful')
                    // Create user object to push to users list
                    let user = {
                        user_id: data.Items[i].user_id,
                        username: data.Items[i].username,
                        address: res.data.results[0].geometry.location
                    }
                    // Push user to users list
                    users.push(user);
                }).catch((err) => {
                    logger.error(`Error attempting to call Google Maps API: ${err}`)
                    reject(err);
                });
                requests.push(request);
            }
            // Wait for all requests to resolve
            Promise.all(requests).then(() => {
                resolve(users);
            }).catch((err) => {
                logger.error(`Error attempting to getAllAddresses: ${err}`)
                reject(err);
            });
        }).catch((err) => {
            logger.error(`Error attempting to getAllAddresses: ${err}`)
            reject(err);
        });
    });
}

// Format address for geocoding
function formatAddress(address) {
    const concatString = `${address.street_number} ${address.street_name} ${address.city} ${address.state} ${address.zip}`;
    return concatString.replace(/\s+/g, '%20');
    
}

// ============================== Logger ==============================
// Winston logger setup
const { createLogger, transports, format} = require('winston');

// Create the logger
const logger = createLogger({
    level: 'info', 
    format: format.combine(
        format.timestamp(),
        format.printf(({timestamp, level, message}) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // log to the console
    ]
})

module.exports = {
    getAddress,
    getAllAddresses
}