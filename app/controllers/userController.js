'use strict';

const Services = require('../services'),
    UniversalFunctions = require('../../utils/universalFunctions'),
    Config = require('../../config'),
    Template = require('../templates'),
    ObjectId = require('mongodb').ObjectID,
    getTimezone = require('node-timezone').getTimezone,
    schedule = require('node-schedule'),
    moment = require('moment-timezone'),
    Models = require('../models'),
    rp = require('request-promise'),
    SmsManager = require('../lib/SmsManager'),
    NotificationManager = require('../lib/NotificationManager'),
    TokenManager = require('../lib/TokenManager'),
    emailManager = require('../lib/EmailManager'),
    ffmpeg = require('ffmpeg');


class userController {

    static async userSignUp(payloadData) {
        try {

            console.log("1111111   ", UniversalFunctions.createHash(payloadData.password))
            let dataToSave ={
               firstName : payloadData.firstName,
               lastName : payloadData.lastName,
               email : payloadData.email,
               password : await UniversalFunctions.createHash(payloadData.password)
            }

            let insertIntoDb =await Services.DbOperations.saveData(Models.Users, dataToSave)
            return "Register Successfilly. "
        } catch (err) {
            console.log('===============  Error ============== ', err);
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }



    static async UserLogin(payloadData) {
        try {
            let criteria = {
                email: payloadData.email
            };
            let projection = {
                email: 1,
                password: 1
            };
            let option = {
                lean: true
            };

            let userData = await Services.DbOperations.getData(Models.Users, criteria, projection, option);
            console.log("llllllllllllllllllllll   ",userData);
            if (!userData || !userData.length) {
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL);
            }
            let isMatched = await UniversalFunctions.compareHashPassword(payloadData.password, userData[0].password)
            if (!isMatched) {
                await Services.DbOperations.findAndUpdate(Models.Users, { _id: userData[0]._id }, { $push: { loginAttempts: { validAttempt: false, ipAddress: payloadData.ipAddress } } }, { new: true });
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PASSWORD);
            }

            let tz = Math.floor((Math.random() * 10000) + 10000);
            let tokenData = {
                id: userData[0]._id,
                random: tz,
                type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.USER
            };

            let token = await TokenManager.setToken(tokenData, Config.APP_CONSTANTS.DATABASE.TOKEN_FIELDS.ACCESS_TOKEN)
            delete userData[0].password;
            delete userData[0].__v;
            userData[0].accessToken = token.accessToken;
            return userData[0]

        } catch (err) {
            console.log('===============  Error ============== ', err);
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }

    static async createPost() {
        try {

        } catch (err) {
            console.log("errrrrrrrrrrrrr ", err)
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }



    static async addPersonalInfo(payloadData, userData) {
        try {
            if (payloadData.email) {
                let findAlreadyEmail = await Services.DbOperations.findOne(Models.Users, { email: payloadData.email }, { email: 1 }, { lean: true });
                if (findAlreadyEmail) return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.ALREADY_EXISTS_EMAIL);
            }


            let dataToUpdate = {
                email: payloadData.email,
                firstName: payloadData.firstName,
                lastName: payloadData.lastName,
                gender: payloadData.gender,
                image: payloadData.image,
                latitude: payloadData.latitude,
                longitude: payloadData.longitude,
                location: [Number(payloadData.longitude), Number(payloadData.latitude)],
                address: payloadData.address,
                cityName: payloadData.cityName,
                major: payloadData.major
            }

            if (payloadData.educationLavel) {
                dataToUpdate.educationLavel = payloadData.educationLavel;
            }

            let dataToSend = await Services.DbOperations.findAndUpdate(Models.Users, { _id: ObjectId(userData.id) }, dataToUpdate, { lean: true, new: true });


            dataToSend.accessToken = payloadData.token;
            delete dataToSend.__v;
            return dataToSend;

        } catch (err) {
            console.log(err)
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }

    static async getEducationLavel(payloadData, userData) {
        try {

            let agreegateData = [
                { "$match": { "type": Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.EDUCATION_LAVEL, "isActive": true, "isDeleted": false } },
                {
                    "$project": {
                        "_id": 1,
                        "name": { $cond: { if: { $eq: [payloadData.language, 1] }, then: "$name.englishName", else: "$name.arabicName" } },
                        "type": 1,
                        "subName": {
                            "$map": {
                                "input": "$subName",
                                "as": "subName",
                                in: { "_id": "$$subName._id", "name": { $cond: { if: { $eq: [payloadData.language, 1] }, then: "$$subName.englishName", else: "$$subName.arabicName" } } }
                            }
                        }
                    }
                }
            ]


            let dataToSend = await Services.DbOperations.aggregateData(Models.CommonService, agreegateData);
            return dataToSend;

        } catch (err) {
            console.log(err, 'sgudsugd')
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }


    static async videoIntegrations(payloadData, userData) {
        try {
            var process = new ffmpeg('/home/cbl1054/Desktop/[FreeTutorials.Us] Udemy - the-complete-nodejs-developer-course-2/01 Welcome');
            process.then(function (video) {
                // Video metadata
                console.log("kkkkkkkkkkkkkkk   ",video.metadata);
                // FFmpeg configuration
                console.log("llllllllllllllll  ",video.info_configuration);
            }, function (err) {
                console.log('Error: ' + err);
            });


        } catch (err) {
            console.log(err, 'sgudsugd')
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }
    }


}

module.exports = userController;
