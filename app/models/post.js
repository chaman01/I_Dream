const  mongoose             = require('mongoose'),
       Config               = require('../../config'),
       Schema               = mongoose.Schema;


let Post=Schema({
    userId:{type:Schema.Types.ObjectId,required:true,ref:"Users",index:true},
    postType:{type:Number,required:true,index:true,
    enum:[Config.APP_CONSTANTS.POST_TYPE.IMAGE,Config.APP_CONSTANTS.POST_TYPE.VIDEO]},
    image:{original:{type:String,default:""},thumbnail:{type:String,default:""}},
    video:{original:{type:String,default:""},thumbnail:{type:String,default:""}},
    status:{text:{type:String,default:""},color:{type:String,default:""}},
    likes:[{type:Schema.Types.ObjectId,ref:'Users'}],
    description:{type: String,default:"" },
    rating:{type:Number,default:0.0},
    ratedUserCount:{type:Number,default:0},
    isActive:{ type:Boolean, default:true},
    isDeleted:{type:Boolean,default:false},
    country:{type:String,default:""},
    city:{type:String,default:""},
    createAt:{type:Date,default:Date.now}
});

module.exports=mongoose.model('Post',Post);
