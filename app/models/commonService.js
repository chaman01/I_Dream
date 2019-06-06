const  mongoose             = require('mongoose'),
    Config                  = require('../../config'),
    Schema                  = mongoose.Schema;

let threeSubName={
    englishName:{type:String,default:""},
    arabicName:{type:String,default:""}
}

let subName={
    englishName:{type:String,default:""},
    arabicName:{type:String,default:""},
    threeSubName:[threeSubName]
}
let commonService = Schema({
    name:{englishName:{type:String,default:""},arabicName:{type:String,default:""}},
    subName:[subName],
    type:{type:Number,default:Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.EDUCATION_LAVEL,enum:[
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.EDUCATION_LAVEL,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.EDUCATION_TYPE,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.GENDER,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.STUDY_LOCATION,,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.CONTACT_US,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.SERVICE_TYPE,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.SUITABLE_PERIOD,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.DYNAMIC_TEXT,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.SUBJECT,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.MAXIMUM_STUDENT,
        Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.COMPLAINT_REASON
    ]},
    dynamicTextType:{type:Number,default:Config.APP_CONSTANTS.DYNAMIC_TEXT_TYPE.DEFAULT,enum:[
        Config.APP_CONSTANTS.DYNAMIC_TEXT_TYPE.DEFAULT,
        Config.APP_CONSTANTS.DYNAMIC_TEXT_TYPE.FAVOURITE_TEACHER_DISCOUNT
    ]},
    discount:{type:Number,default:0.0},
    count:{type:Number,default:0},
    isActive:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false}
 },{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model("commonService", commonService);
