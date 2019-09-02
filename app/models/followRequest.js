const  mongoose             = require('mongoose'),
       Config               = require('../../config'),
       Schema               = mongoose.Schema;


let FlowerRequest=Schema({
    senderId:{type:Schema.Types.ObjectId,ref:'Users'},
    reciverId : {type :Schema.Types.ObjectId ,ref:'Users'},        
    status : {type : Number,default:Config.APP_CONSTANTS.STATUS.PENDING,enum : [ Config.APP_CONSTANTS.STATUS.ACCEPTED,Config.APP_CONSTANTS.STATUS.PENDING,Config.APP_CONSTANTS.STATUS.CANCELLED,Config.APP_CONSTANTS.STATUS.REJECTED]}
    },
    {
    timestamps:{
        createdAt:"createdAt",
        updatedAt:"updatedAt"
    }
});
module.exports=mongoose.model('FlowerRequest',FlowerRequest);