const  mongoose             = require('mongoose'),
    Config                  = require('../../config'),
    Schema                  = mongoose.Schema;
let contactus = Schema({
    website:{type:String,required:true},
    email:{type:String,required:true},
    socialMedia:{
        facebook:{type:String,required:true},
        youtube:{type:String,required:true},
        twitter:{type:String,required:true},
        instagram:{type:String,required:true},
        googlePlus:{type:String,required:true}
    },
    isActive:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false}
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});
module.exports = mongoose.model("contactus", contactus);
