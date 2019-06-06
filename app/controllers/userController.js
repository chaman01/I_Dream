'use strict';

const Services                          = require('../services'),
      UniversalFunctions                = require('../../utils/universalFunctions'),
      Config                            = require('../../config'),
      Template                          = require('../templates'),
      ObjectId                          = require('mongodb').ObjectID,
      getTimezone                       = require('node-timezone').getTimezone,
      schedule                          = require('node-schedule'),
      moment                            = require('moment-timezone'),
      Models                            = require('../models'),
      rp                                = require('request-promise'),
      SmsManager                        = require('../lib/SmsManager'),
      NotificationManager               = require('../lib/NotificationManager'),
      TokenManager                      = require('../lib/TokenManager'),
      emailManager                      = require('../lib/EmailManager');


class userController {
    static async sendOtp(payloadData){
        try{
            let otp = Math.floor(Math.random()*10000);
            payloadData.otp=otp;
            payloadData.expireIn=((+new Date())+(2*60*1000))
            // await SmsManager.sendVerificationCode();
            
            await emailManager.unifonicIntegration(payloadData.fullNumber, otp)

            let dataToSend=await Services.DbOperations.saveData(Models.SmsOtp,payloadData);
            console.log(dataToSend,'dataToSenddataToSenddataToSenddataToSenddataToSenddataToSend')
            return {"_id":dataToSend._id};
        }catch(err){
            console.log(err)
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
         }
    }



    static async verifyOtp(payloadData){
        try{
             let findOtpDetail=await Services.DbOperations.findOne(Models.SmsOtp,{fullNumber:payloadData.fullNumber,otp:payloadData.otp,_id:payloadData.otpId});
             console.log(findOtpDetail,'findOtpDetailfindOtpDetailfindOtpDetailfindOtpDetail')
             if(!findOtpDetail) return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_OTP_ID);

             if(findOtpDetail.expireIn<(+new Date())) return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.OTP_EXPIRED);

             let userData=await Services.DbOperations.findOne(Models.Users,{"fullNumber":findOtpDetail.fullNumber},{},{lean:true});
             if(userData===null){
                 let dataToSave={
                     fullNumber:payloadData.fullNumber,
                     callingCode:payloadData.callingCode,
                     deviceType:payloadData.deviceType,
                     deviceToken:payloadData.deviceToken,
                     userType:payloadData.userType
                 }
                 let saveData=await Services.DbOperations.saveData(Models.Users,dataToSave);
                 let tokenData = {
                     id: saveData._id,
                     random: Math.floor((Math.random() * 10000) + 10000),
                     type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER
                 };
                 let token = await TokenManager.setToken(tokenData, Config.APP_CONSTANTS.DATABASE.TOKEN_FIELDS.ACCESS_TOKEN);
                 saveData.accessToken=token.accessToken;
                 saveData.isExists=false;
                 delete saveData.__v;
                 return saveData;

             }else{
                 if(userData.isBlocked)
                 return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.BLOCKED_BY_ADMIN);
                 let tokenData = {
                     id: userData._id,
                     random: Math.floor((Math.random() * 10000) + 10000),
                     type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER
                 };
                 let token = await TokenManager.setToken(tokenData, Config.APP_CONSTANTS.DATABASE.TOKEN_FIELDS.ACCESS_TOKEN);
                 userData.accessToken=token.accessToken;
                 userData.isExists=true;
                 delete userData.__v;
                 return userData;
             }

        }catch(err){
            console.log(err);
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }

    static async addPersonalInfo(payloadData,userData){
         try{
            if(payloadData.email) {
                let findAlreadyEmail=await Services.DbOperations.findOne(Models.Users,{email:payloadData.email},{email:1},{lean:true});
                if(findAlreadyEmail) return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_EXISTS_EMAIL);
            }


            let dataToUpdate={
                 email:payloadData.email,
                 firstName:payloadData.firstName,
                 lastName:payloadData.lastName,
                 gender:payloadData.gender,
                 image:payloadData.image,
                 latitude:payloadData.latitude,
                 longitude:payloadData.longitude,
                 location:[Number(payloadData.longitude),Number(payloadData.latitude)],
                 address:payloadData.address,
                 cityName:payloadData.cityName,
                 major:payloadData.major
             }

            if(payloadData.educationLavel){
                dataToUpdate.educationLavel=payloadData.educationLavel;
            }

            let dataToSend=await Services.DbOperations.findAndUpdate(Models.Users,{_id:ObjectId(userData.id)},dataToUpdate,{lean:true,new:true});


            dataToSend.accessToken=payloadData.token;
            delete dataToSend.__v;
            return dataToSend;

         }catch(err){
            console.log(err)
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
         }
    }

    static async getEducationLavel(payloadData,userData){
        try{

            let agreegateData=[
                        {"$match":{"type":Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.EDUCATION_LAVEL,"isActive" : true,"isDeleted" : false}},
                        {"$project":{
                        "_id":1,
                        "name":{ $cond: { if: { $eq: [payloadData.language, 1 ]}, then: "$name.englishName", else: "$name.arabicName"}},
                        "type":1,
                        "subName":{"$map":{
                                "input": "$subName",
                                "as": "subName",
                                in:{"_id":"$$subName._id","name":{ $cond: { if: { $eq: [payloadData.language, 1 ]}, then: "$$subName.englishName", else: "$$subName.arabicName"}}}
                            }}
                        }}
                ]


            let dataToSend=await Services.DbOperations.aggregateData(Models.CommonService,agreegateData);
            return dataToSend;

        }catch (err) {
            console.log(err,'sgudsugd')
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }


}

module.exports = userController;
