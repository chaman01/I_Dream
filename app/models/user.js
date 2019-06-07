const  mongoose             = require('mongoose'),
       Config               = require('../../config'),
       Schema               = mongoose.Schema;


let user = Schema({
    firstName:{type:String},
    lastName:{type:String},
    image:{original:{type:String},thumbnail:{type:String}},
    latitude:{type:Number},
    longitude:{type:Number},
    email:{type:String},
    isBlocked:{type:Boolean,default:false},
    isDeleted:{type:Boolean,default:false},
    deviceToken:{type:String,default:""},
    accessToken:{type:String,default:""},
    followers:[{type:Schema.Types.ObjectId,ref:'Users'}],
    following:[{type:Schema.Types.ObjectId,ref:'Users'}]
 },{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model("user", user);
