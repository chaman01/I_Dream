const Joi = require('joi');
const UniversalFunctions = require('../../utils/universalFunctions');
const Controller = require('../controllers');
const CONFIG = require('../../config');

let non_auth_routes = [
    {
        method: 'POST',
        path: '/admin/login',
        handler: async (request, reply)=>{
            try{
                let queryData = {
                    email: request.payload.email,
                    password: request.payload.password,
                    ipAddress: request.info.remoteAddress
                };
                let dataToSend = await Controller.AdminController.adminLogin(queryData);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,dataToSend);
            }catch(err){
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'Login for Super Admin',
            tags: ['api', 'admin'],
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload: {
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType : 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    }

];

let auth_routes = [
    {
        method: 'GET',
        path: '/admin/userListing',
        handler: async (request, reply)=>{
            try{

                let queryData={
                    perPage:request.query.perPage,
                    page:request.query.page,
                    userType:request.query.userType
                }
                let dataToSend = await Controller.AdminController.UserListing(queryData);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,dataToSend);
            }catch(err){
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'User listing to Admin',
            auth:CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.ADMIN,
            tags: ['api', 'admin'],
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                query: {
                    cityName:Joi.string().optional().allow(""),
                    educationType:Joi.string().optional().allow(""),
                    subEducationType:Joi.array().optional().items(Joi.string().optional()),
                    educationLabelId:Joi.string().optional().allow(""),
                    subEducationLabel:Joi.array().optional().items(Joi.string().optional()),
                    subject:Joi.string().optional(),
                    gender:Joi.string().optional().allow(""),
                    registrationDate:Joi.string().allow(""),
                    accountStatus:Joi.number().optional(),
                    verification:Joi.boolean().optional(),
                    nationality:Joi.string().optional(),
                    educationQualification:Joi.string().optional().allow(""),
                    page:Joi.number().optional(),
                    perPage:Joi.number().optional(),
                    isCsv:Joi.boolean().optional(),
                    userType:Joi.number().optional().valid([
                        CONFIG.APP_CONSTANTS.USER_TYPE.TEACHER,
                        CONFIG.APP_CONSTANTS.USER_TYPE.STUDENT
                    ]).description('TEACHER:2, STUDENT:1')
                },
                headers : UniversalFunctions.authorizationAdminHeaderObj,
            },
            plugins: {
                'hapi-swagger': {
                    payloadType : 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    }

];

module.exports = [...non_auth_routes,...auth_routes];
