const Jwt = require('jsonwebtoken');
const DbOperations = require ('../services/DBoperations');
const Config = require('../../config');
const Models = require('../models');

const setToken = async function (tokenData,field) {

    if (!tokenData.id || !tokenData.type) {
        return (Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR);
    } else {
        let tokenToSend = await Jwt.sign(tokenData,process.env.JWT_SECRET_KEY);
        return ({accessToken: tokenToSend});
    }

};

const tokenToForgot = async function (tokenData,field) {
       return await Jwt.sign(tokenData,process.env.JWT_SECRET_KEY);
};

const getTokenFromDB = async (userId, userType) =>{
    let criteria = {
        _id: userId
    };
    let data;
    if (userType == Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER)
        data = await DbOperations.findOne(Models.Users,criteria,{},{lean:true})
    if(userType == Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN){
        data = await DbOperations.findOne(Models.Admins,criteria,{},{lean:true});
    }
    if(data===null)  return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
    else{
        data.userType=userType;
        return data;
    }
};

const verifyToken = async function (token) {
    try{

     console.log(token,'tokentokentoken')
    if(token.id && token.type && token.random){
    let data= await getTokenFromDB(token.id, token.type, token.random);
    return {isValid:true , data:data};
    }
    else return (Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN);
    }catch(err){
        return {isValid:false};
    }
};

const verifyForgotToken=async function(token){
    return await Jwt.verify(token,process.env.JWT_SECRET_KEY)
}

module.exports = {
    verifyForgotToken:verifyForgotToken,
    tokenToForgot:tokenToForgot,
    setToken:setToken,
    verifyToken:verifyToken
};
