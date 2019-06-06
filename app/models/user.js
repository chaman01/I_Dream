const  mongoose             = require('mongoose'),
       Config               = require('../../config'),
       Schema               = mongoose.Schema;

let educationType={
    educationTypeId:{type:Schema.Types.ObjectId,ref:'commonService'},
    subEducationTypeId:[{type:Schema.Types.ObjectId}]
}

let mainEducationLabel={
    mainEducationLabelId:{type:Schema.Types.ObjectId,ref:'commonService'},
    subEducationLabelId:[{type:Schema.Types.ObjectId}]
}

let teachinSubject={
    subjectId:{type:Schema.Types.ObjectId,ref:'commonService'},
    subjectLabels:[
        {
            subSubjectLabelId:{type:Schema.Types.ObjectId},
            subSubjectChildLabelId:[{type:Schema.Types.ObjectId}]
        }
    ]
}

let persionalInfo={
    iqamaId:{type:Number},
    fullName:{type:String},
    birthDate:{type:Date},
    nationality:{type:String,default:""},
    createAt:{type:Date}
}

let certificateInfo={
    educationLavel:{type:Schema.Types.ObjectId,ref:'commonService'},
    grade:{type:String},
    major:{type:String},
    countryOfGraduation:{type:String },
    dateOfgraduation:{type:Date},
    university:{type:String},
    createAt:{type:Date}
}

let attachment={
    iqama:{name:{type:String},original:{type:String},thumbnail:{type:String}},
    certificate:{name:{type:String},original:{type:String},thumbnail:{type:String}},
    cv:{name:{type:String},original:{type:String},thumbnail:{type:String}},
    createAt:{type:Date}
}


let user = Schema({
    fullNumber:{type:String,required:true,index:true},
    callingCode:{type:String,default:""},
    firstName:{type:String},
    lastName:{type:String},
    image:{original:{type:String},thumbnail:{type:String}},
    gender:{type:Number},
    latitude:{type:Number},
    longitude:{type:Number},
    location: {type: [Number], index: '2dsphere'},
    address:{type:String},
    cityName:{type:String,default:""},
    email:{type:String},
    nationality:{type:String,default:""},
    educationType:[educationType],
    educationLavel:{type:Schema.Types.ObjectId,ref:'commonService'},
    teachinSubject:[teachinSubject],
    favouriteTeacher:[{type:Schema.Types.ObjectId,ref:'user'}],
    major:{type:String},
    isBlocked:{type:Boolean,default:false},
    isActive:{type:Boolean,default:true},
    isBanned:{type:Boolean,default:false},
    isOnline:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false},
    deviceType:{type:String,
        default:Config.APP_CONSTANTS.DEVICE_TYPE.ANDROID,
        enum:[
            Config.APP_CONSTANTS.DEVICE_TYPE.ANDROID,
            Config.APP_CONSTANTS.DEVICE_TYPE.IOS,
            Config.APP_CONSTANTS.DEVICE_TYPE.WEB
        ]
    },
    deviceToken:{type:String,default:""},
    accessToken:{type:String,default:""},
    isVerified:{type:Boolean,default:false},
    isNotificationAllow:{type:Boolean,default:true},
    userType:{type:Number,
        default:Config.APP_CONSTANTS.USER_TYPE.STUDENT,
        enum:[
            Config.APP_CONSTANTS.USER_TYPE.STUDENT,
            Config.APP_CONSTANTS.USER_TYPE.TEACHER
        ]
    },
    isExists:{type:Boolean,default:false},
    language:{type:Number,
        default:Config.APP_CONSTANTS.LANGUAGE_TYPE.ARABIC,
        enum:[
            Config.APP_CONSTANTS.LANGUAGE_TYPE.ARABIC,
            Config.APP_CONSTANTS.LANGUAGE_TYPE.ENGLISH
        ]
    },
    step:{type:Number},
    isInfoVerified:{type:Boolean,default:false},
    persionalInfo:persionalInfo,
    certificateInfo:certificateInfo,
    attachment:attachment
 },{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model("user", user);
