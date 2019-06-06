const  mongoose             = require('mongoose'),
    Schema                  = mongoose.Schema;
let educationType = Schema({
    fullNumber:{type:String,required:true,trim:true,index:true},
    otp:{type:Number,required:true,index:true},
    isActive:{type:Boolean,default:true},
    expireIn:{type:Number,default:((+new Date())+(2*60*1000))}
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model("educationType", educationType);
