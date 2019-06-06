const  mongoose             = require('mongoose'),
    Config                  = require('../../config'),
    Schema                  = mongoose.Schema;

let tcpServices = Schema({
    name:{englishName:{type:String,default:""},arabicName:{type:String,default:""}},
    content:{englishName:{type:String,default:""},arabicName:{type:String,default:""}},
    type:{type:Number,default:Config.APP_CONSTANTS.TCP_SERVICES.TERMS_CONDITIONS,
        enum:[
            Config.APP_CONSTANTS.TCP_SERVICES.KNOW_MORE,
            Config.APP_CONSTANTS.TCP_SERVICES.ABOUT_US,
            Config.APP_CONSTANTS.TCP_SERVICES.TERMS_CONDITIONS,
            Config.APP_CONSTANTS.TCP_SERVICES.PRIVACY_POLICY
        ]
    },
    userType:{type:Number},
    isActive:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false}
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model("tcpServices", tcpServices);
