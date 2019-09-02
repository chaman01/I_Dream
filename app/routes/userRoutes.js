const Joi                       = require('joi'),
      UniversalFunctions        = require('../../utils/universalFunctions'),
      Controller                = require('../controllers'),
      Path                      = require('path'),
      CONFIG                    = require('../../config');

let non_auth_routes = [
    {
        method: 'POST',
        path: '/user/userSignUp',
        handler: async (request, reply)=>{
            try{
                let payloadData = request.payload;
                payloadData.language=request.headers.language;
                let dataToSend = await Controller.UserController.userSignUp(payloadData);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,dataToSend,request.headers.language);
            }catch(err){
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'user sign up',
            tags: ['api', 'users'],
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload:{
                    firstName : Joi.string().required(),
                    lastName : Joi.string().required(),
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
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
        path: '/user/login',
        handler: async (request, reply)=>{
            try{
                let payloadData = request.payload;
                payloadData.language=request.headers.language;
                let dataToSend = await Controller.UserController.UserLogin(payloadData);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,dataToSend,request.headers.language);
            }catch(err){
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'user login',
            tags: ['api', 'users'],
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload:{
                    email: Joi.string().email().required(),
                    password: Joi.string().required()
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
        path: '/user/createPost',
        handler: async (request, reply)=>{
            try{
                let payloadData = request.payload;
                payloadData.language=request.headers.language;
                payloadData.token=request.headers.authorization;
                let dataToSend = await Controller.UserController.createPost(payloadData,request.auth.credentials);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFICATION,dataToSend);
            }catch(err){
                console.log(err,'sdgsgdgsiugduisuhid');
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'create new post',
            tags: ['api', 'users'],
            auth:CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER,
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload: {
                    postType: Joi.number().required().valid([CONFIG.APP_CONSTANTS.POST_TYPE.IMAGE, CONFIG.APP_CONSTANTS.POST_TYPE.VIDEO]).description("IMAGE=>1,VIDEO=>2"),
                    image: Joi.object().optional().keys({
                        thumbnail: Joi.string().optional().allow(""),
                        original: Joi.string().optional().allow("")
                    }).description("image:{'original':'','thumbnail':''}"),
                    video: Joi.object().optional().keys({
                        thumbnail: Joi.string().optional().allow(""),
                        original: Joi.string().optional().allow("")
                    }).description("video:{'original':'','thumbnail':''}"),
                    description: Joi.string().optional(),
                    lat: Joi.number().optional(),
                    lng: Joi.number().optional(),
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
    },

    {
        method: 'POST',
        path: '/user/videoIntegrations',
        handler: async (request, reply)=>{
            try{
                let payloadData = request.payload;
                payloadData.language=request.headers.language;
                payloadData.token=request.headers.authorization;
                let dataToSend = await Controller.UserController.videoIntegrations(payloadData,request.auth.credentials);
                return UniversalFunctions.sendSuccess(CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFICATION,dataToSend);
            }catch(err){
                console.log(err,'sdgsgdgsiugduisuhid');
                return UniversalFunctions.sendError(err)
            }
        },
        config: {
            description: 'create new post',
            tags: ['api', 'users'],
            auth:CONFIG.APP_CONSTANTS.DATABASE.USER_ROLES.USER,
            validate: {
                failAction: UniversalFunctions.failActionFunction,
                payload: {
                    // video: Joi.object().optional().keys({
                    //     thumbnail: Joi.string().optional().allow(""),
                    //     original: Joi.string().optional().allow("")
                    // }).description("video:{'original':'','thumbnail':''}"),
                    // description: Joi.string().optional(),
                    // lat: Joi.number().optional(),
                    // lng: Joi.number().optional(),
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
