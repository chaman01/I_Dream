const Joi              =        require('joi'),
      MD5              =        require('md5'),
      bcrypt           =        require('bcrypt'),
      AWS              =        require('aws-sdk'),
      fs               =        require('fs'),
      Boom             =        require('boom'),
      path             =        require('path'),
      CONFIG           =        require('../config');
exports.sendError =async(data)=>{
    if(typeof data =='object'&&data.hasOwnProperty('statusCode')&&data.hasOwnProperty('customMessage')){
        let msg=data.customMessage;
        msg=msg.replace(msg.charAt(0),msg.charAt(0).toUpperCase());
        let errorToSend=new Boom(msg,{statusCode:data.statusCode});
        errorToSend.output.payload.responseType=data.type;
        return errorToSend;
    }else{
        let errorToSend='';
        if(typeof data=='object'){
            if(data.name=='MongoError'){
                errorToSend+=CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage;
                if(data.code==11000){
                    let duplicateValue=data.errmsg&&data.errmsg.substr(data.errmsg.lastIndexOf('{ : "')+5);
                    duplicateValue=duplicateValue.replace('}','');
                    errorToSend+=CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE.customMessage + " : " + duplicateValue;
                    if(data.message.indexOf('customer_1_streetAddress_1_city_1_state_1_country_1_zip_1')>-1){
                        errorToSend = CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DUPLICATE_ADDRESS.customMessage;
                    }
                }
            }else if(data.name=='ApplicationError'){
                errorToSend+=CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + ':'
            }else if(data.name=='ValidationError'){
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.APP_ERROR.customMessage + data.message;
            }else if(data.name=='CastError'){
                errorToSend += CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.DB_ERROR.customMessage + CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID.customMessage + data.value;
            }
        }else{
            errorToSend=data;
        }

        let customErrorMessage=errorToSend;
        if(typeof customErrorMessage=='string'){
            if(errorToSend.indexOf("[")>-1){
                customErrorMessage=errorToSend.substr(errorToSend.indexOf("["));
            }
            customErrorMessage=customErrorMessage&&customErrorMessage.replace(/"/g,'');
            customErrorMessage=customErrorMessage&&customErrorMessage.replace("[",'');
            customErrorMessage=customErrorMessage&&customErrorMessage.replace("]",'');
            customErrorMessage=customErrorMessage.replace(customErrorMessage.charAt(0),customErrorMessage.charAt(0).toUpperCase());
        }
        return new Boom(customErrorMessage,{statusCode:400})

    }
}


exports.sendSuccess=async(successMsg,data,language)=>{
    language=language||CONFIG.APP_CONSTANTS.LANGUAGE_TYPE.ENGLISH
    successMsg=successMsg||CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT.customMessage
    if(typeof successMsg=='object'&&successMsg.hasOwnProperty('statusCode')&&successMsg.hasOwnProperty('customMessage')){
        return {statusCode:successMsg.statusCode,message:successMsg.customMessage,data:data||null}
    }else{
        return {statusCode:200,message:successMsg,data:data||null}
    }
}
exports.failActionFunction=async(request, reply, error) =>{
    error.output.payload.type = "Joi Error";
    if (error.isBoom) {
        delete error.output.payload.validation;
        if (error.output.payload.message.indexOf("authorization") !== -1) {
            error.output.statusCode = ERROR.UNAUTHORIZED.statusCode;
            return error;
        }
        let details = error.details[0];
        if (details.message.indexOf("pattern") > -1 && details.message.indexOf("required") > -1 && details.message.indexOf("fails") > -1) {
            error.output.payload.message = "Invalid " + details.path;
            return error
        }
    }
    let customErrorMessage = '';
    if (error.output.payload.message.indexOf("[") > -1) {
        customErrorMessage = error.output.payload.message.substr(error.output.payload.message.indexOf("["));
    } else {
        customErrorMessage = error.output.payload.message;
    }
    customErrorMessage = customErrorMessage.replace(/"/g, '');
    customErrorMessage = customErrorMessage.replace('[', '');
    customErrorMessage = customErrorMessage.replace(']', '');
    error.output.payload.message = customErrorMessage.replace(/\b./g, (a) => a.toUpperCase());
    delete error.output.payload.validation;
    return error;
};
exports.compareHashPassword=async(plainTextPassword,hash)=>{
   return await bcrypt.compareSync(plainTextPassword, hash)
}
exports.createHash=async(plainText)=>{
    return await bcrypt.hashSync(plainText,10)
}
exports.authorizationHeaderObj=Joi.object({
    authorization:Joi.string().required(),
    language:Joi.number().required().valid([CONFIG.APP_CONSTANTS.LANGUAGE_TYPE.ENGLISH,CONFIG.APP_CONSTANTS.LANGUAGE_TYPE.ARABIC]).description('1=>english,2=>arabic')
}).unknown();

exports.authorizationAdminHeaderObj=Joi.object({
    authorization:Joi.string().required()
}).unknown();

exports.languageHeaderObj=Joi.object({
    language:Joi.number().required().valid([CONFIG.APP_CONSTANTS.LANGUAGE_TYPE.ENGLISH,CONFIG.APP_CONSTANTS.LANGUAGE_TYPE.ARABIC]).description('1=>english,2=>arabic')
}).unknown();
exports.escapeRegExp=async(str) => {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
exports.CONFIG = require('../config');
exports.createSession=()=>{
    let opentok = new OpenTok(process.env.OPEN_TALK_API_KEY,process.env.OPEN_TALK_SECRET_KEY);
    return new Promise(function(resolve,reject){
        opentok.createSession(function(err, session) {
            if (err) {
                reject(err);
            }else{
                resolve(session);
            }
          });
    })
}




exports.generatePdfFile = async (eTicketFile ) => {
    try {
        let fileName = (new Date()).getTime();
        let newPath = path.join(__dirname, '../../', '/public/uploads/' +  fileName + ".html");
        console.log(newPath);
        let content1 = await writedirAsync(newPath, eTicketFile);

        const instance = await phantom.create();
        const page = await instance.createPage();
        await page.on('onResourceRequested', function(requestData) {
            console.info('Requesting', requestData.url);
        });
        console.log(newPath);
        await page.property(
            'paperSize', {
                format:'A4',
                height: '1320px',
                orientation: 'portrait',
                margin: '20px'}
        );

        var settings = {
            encoding: "utf8",
        };

        const status = await page.open(newPath,);
        const content = await page.property('content');
        const pdfPath = path.join(__dirname, '../../', '/public/uploads/' + fileName + ".pdf");
        await page.render(pdfPath);

        await instance.exit();

        return {
            pdfPath: pdfPath,
            newPath: newPath
        };
    }
    catch (err) {
        throw err;
    }
}

const writedirAsync = (path, data) =>{
    return new Promise(function (resolve, reject) {
        fs.writeFile(path, data, function (error) {
            if (error) {
                console.log("===error=========",error)
                reject(error);
            } else {
                resolve();
            }
        });
    });
}
