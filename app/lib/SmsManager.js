'use strict';
const twilio        =   require('twilio'),
      Services      =   require('../services'),
      Models        =   require('../models'),
      Config        =   require('../../config');
async function sendVerificationCode(message,phoneNumber){
    try{
        let client = new twilio(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
        let msg=await client.messages.create({body:message,to:phoneNumber,from:process.env.PHONE_NUMBER});
        return Promise.resolve(msg);
    }catch(err){
        return Promise.reject(err);
    }
}

async function verify(uid,code){
    try{
        var criteria = {
            _id:uid,
            phoneVerificationCode:code
        }
        console.log("_______v________",criteria);

        var p = await Services.DbOperations.findOne(Models.Users,criteria,{},{});
        if(p && p.length){
            let setQuery = {
                $unset:{
                    phoneVerificationCode:1
                },phoneVerified:true
            };
            var z = await Services.DbOperations.findAndUpdate(Models.Users,criteria,setQuery,{new:true})
            return (Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.VERIFIED,null)
        }
    }catch(err){
        console.log("verify_______",err)
        return Config.APP_CONSTANTS.STATUS_MSG.ERROR.IMP_ERROR
    }
}

module.exports = {
    verify:verify,
    sendVerificationCode:sendVerificationCode
}


