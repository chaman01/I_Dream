const  mongoose             = require('mongoose'),
    Config                  = require('../../config'),
    Schema                  = mongoose.Schema;

let complaint = Schema({
    reason:{type:Schema.Types.ObjectId,ref:'commonService',index:true},
    message:{type:String,required:true},
    isActive:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false},
    type:{
        type:Number,default:Config.APP_CONSTANTS.ISSUE_TYPE.COMPLAINT,enum:[
            Config.APP_CONSTANTS.ISSUE_TYPE.COMPLAINT
        ]
    }
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});
module.exports = mongoose.model("complaint", complaint);
