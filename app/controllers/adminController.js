'use strict';
const Services = require('../services'),
    UniversalFunctions = require('../../utils/universalFunctions'),
    Config = require('../../config'),
    Models = require('../models'),
    ObjectId = require('mongodb').ObjectID,
    NotificationManager = require('../lib/NotificationManager'),
    TokenManager = require('../lib/TokenManager');

class AdminController {
    static async adminLogin(payloadData) {
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

            let adminData = await Services.DbOperations.getData(Models.Admins, criteria, projection, option);
            if (!adminData || !adminData.length) {
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_EMAIL);
            }
            let isMatched = await UniversalFunctions.compareHashPassword(payloadData.password, adminData[0].password)
            if (!isMatched) {
                await Services.DbOperations.findAndUpdate(Models.Admins, { _id: adminData[0]._id }, { $push: { loginAttempts: { validAttempt: false, ipAddress: payloadData.ipAddress } } }, { new: true });
                return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_PASSWORD);
            }

            let tz = Math.floor((Math.random() * 10000) + 10000);
            let tokenData = {
                id: adminData[0]._id,
                random: tz,
                type: Config.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN
            };

            let token = await TokenManager.setToken(tokenData, Config.APP_CONSTANTS.DATABASE.TOKEN_FIELDS.ACCESS_TOKEN)
            delete adminData[0].password;
            delete adminData[0].__v;
            await Services.DbOperations.findAndUpdate(Models.Admins, { _id: adminData[0]._id }, { $push: { loginAttempts: { validAttempt: true, ipAddress: payloadData.ipAddress } }, Random: tz, isActive: true }, { new: true });
            adminData[0].accessToken = token.accessToken;
            return adminData[0]
        } catch (err) {
            console.log('===============  Error ============== ', err);
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }

    }
    static async UserListing(payloadData) {
        try {


            let criteria = {};
            if (payloadData.userType) {
                criteria.userType = payloadData.userType;
            }
            if (payloadData.cityName) {
                criteria.cityName = payloadData.criteria;
            }
            if (payloadData.educationType) {
                criteria["educationType.educationTypeId"] = payloadData.educationType;
            }
            if (payloadData.subEducationTypeId && payloadData.subEducationTypeId.length > 0) {
                criteria["educationType.subEducationTypeId"] = { "$in": payloadData.subEducationTypeId };
            }
            if (payloadData.educationLabelId) {
                criteria["mainEducationLabel.mainEducationLabelId"] = payloadData.educationLabelId;
            }
            if (payloadData.subEducationLabel && payloadData.subEducationLabel.length > 0) {
                criteria["educationType.subEducationLabelId"] = { "$in": payloadData.subEducationLabel };
            }
            if (payloadData.subject) {
                criteria["teachinSubject.subjectId"] = payloadData.subject;
            }
            if (payloadData.gender) {
                criteria.gender = payloadData.gender;
            }

            if (payloadData.registrationDate) {
                criteria.createdAt = new Date(payloadData.registrationDate);
            }


            if (payloadData.nationality) {
                criteria.nationality = payloadData.nationality;
            }

            let aggregateArray = [
                { "$match": criteria },
                {
                    "$project": {
                        "fullNumber": 1,
                        "firstName": 1,
                        "lastName": 1,
                        "image": 1,
                        "gender": 1,
                        "nationality": 1,
                        "latitude": 1,
                        "longitude": 1,
                        "location": 1,
                        "address": 1,
                        "cityName": 1,
                        "email": 1,
                        "educationType": 1,
                        "educationLavel": 1,
                        "teachinSubject": 1,
                        "favouriteTeacher": 1,
                        "isBlocked": 1,
                        "isActive": 1,
                        "isOnline": 1,
                        "isNotificationAllow": 1,
                        "userType": 1,
                        "language": 1,
                        "iqama": 1
                    }
                },
                { "$sort": { "_id": -1 } }
            ]


            let aggregateCount = [
                { "$match": criteria },
                { "$group": { "_id": null, "count": { "$sum": 1 } } }
            ]

            if (payloadData.page && payloadData.perPage > 0) {
                aggregateArray.push(
                    { "$skip": Number(payloadData.perPage * (payloadData.page - 1)) },
                    { "$limit": Number(payloadData.perPage) + Number(payloadData.perPage * (payloadData.page - 1)) }
                )
            }

            let [listing, count] = await Promise.all([
                Services.DbOperations.aggregateData(Models.Users, aggregateArray),
                Services.DbOperations.aggregateData(Models.Users, aggregateCount)
            ]);
            if (payloadData.isCsv) {

            } else {
                return { listing: listing, count: count.length > 0 ? count[0].count : 0 }
            }



        } catch (err) {
            console.log('===============  Error ============== ', err);
            return Promise.reject(Config.APP_CONSTANTS.STATUS_MSG.ERROR.SOMETHING_WENT_WRONG);
        }

    }


}

module.exports = AdminController;
