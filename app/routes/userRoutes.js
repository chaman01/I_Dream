const Joi                       = require('joi'),
      UniversalFunctions        = require('../../utils/universalFunctions'),
      Controller                = require('../controllers'),
      Path                      = require('path'),
      CONFIG                    = require('../../config');

let non_auth_routes = [
    {
        method: 'GET',
        path: '/user/sendOtp',
        handler: async (request, reply)=>{
            try{
                let payloadData = {fullNumber:request.query.fullNumber,language:request.headers.language};
                let dataToSend = await Controller.UserController.sendOtp(payloadData);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.OTP_SEND_SUCCESS,dataToSend,request.headers.language);
            }catch(err){
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'send user otp',
            tags: ['api', 'users'],
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                query: {
                    fullNumber:Joi.string().required().regex(/^\S*$/)
                },
                headers:UniversalFunctions.languageHeaderObj
            },
            plugins: {
                'hapi-swagger': {
                    payloadType : 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },

    {
        method: 'POST',
        path: '/user/verifyOtp',
        handler: async (request, reply)=>{
            try{
                let payloadData = request.payload;
                payloadData.language=request.headers.language;
                let dataToSend = await Controller.UserController.verifyOtp(payloadData);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,dataToSend,request.headers.language);
            }catch(err){
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'verify user otp',
            tags: ['api', 'users'],
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload: {
                    callingCode:Joi.string().optional(),
                    fullNumber:Joi.string().required(),
                    otpId:Joi.string().required().length(24),
                    otp:Joi.number().required(),
                    deviceToken:Joi.string().required(),
                    deviceType:Joi.string().required().valid([CONFIG.APP_CONSTANTS.DEVICE_TYPE.ANDROID,CONFIG.APP_CONSTANTS.DEVICE_TYPE.IOS,CONFIG.APP_CONSTANTS.DEVICE_TYPE.WEB]),
                    userType:Joi.number().required().valid([CONFIG.APP_CONSTANTS.USER_TYPE.STUDENT,CONFIG.APP_CONSTANTS.USER_TYPE.TEACHER])
                },
                headers:UniversalFunctions.languageHeaderObj
            },
            plugins: {
                'hapi-swagger': {
                    payloadType : 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/user/getEducationLavel',
        handler: async (request, reply)=>{
            try{
                let payloadData={};
                payloadData.language=request.headers.language;
                let dataToSend = await Controller.UserController.getEducationLavel(payloadData);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,dataToSend,request.headers.language);
            }catch(err){
                console.log(err,'sfsufusgfug')
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'verify user otp',
            tags: ['api', 'users'],
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                query: {

                },
                headers:UniversalFunctions.languageHeaderObj
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


let auth_routes=[
    {
        method: 'POST',
        path: '/user/addPersonalInfo',
        handler: async (request, reply)=>{
            try{
                let payloadData = request.payload;
                payloadData.language=request.headers.language;
                payloadData.token=request.headers.authorization;
                let dataToSend = await Controller.UserController.addPersonalInfo(payloadData,request.auth.credentials);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFICATION,dataToSend);
            }catch(err){
                console.log(err,'sdgsgdgsiugduisuhid');
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'add persional info for user',
            tags: ['api', 'users'],
            auth:CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER,
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload: {
                    firstName:Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
                    lastName:Joi.string().regex(/^[a-zA-Z ]+$/).trim().min(2).required(),
                    image:Joi.object().optional().allow("").keys({
                        thumbnail:Joi.string().allow(""),
                        original:Joi.string().allow("")
                    }).description("image:{'original':'','thumbnail':''}"),
                    gender:Joi.number().required().valid([CONFIG.APP_CONSTANTS.GENDER_TYPE.MALE,CONFIG.APP_CONSTANTS.GENDER_TYPE.FEMALE]).description("1=>male,2=>female"),
                    latitude:Joi.number().required(),
                    longitude:Joi.number().required(),
                    address:Joi.string().required(),
                    cityName:Joi.string().required(),
                    email:Joi.string().optional().allow(""),
                    educationLavel:Joi.string().optional().allow(""),
                    major:Joi.string().optional().allow("")
                },
                headers:UniversalFunctions.authorizationHeaderObj

            },
            plugins: {
                'hapi-swagger': {
                    payloadType : 'form',
                    responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
                }
            }
        }
    }
]

module.exports = [...non_auth_routes,...auth_routes];
