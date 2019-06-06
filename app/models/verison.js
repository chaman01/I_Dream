const mongoose=require('mongoose'),
      Schema = mongoose.Schema;
let version=Schema({
    versionNumber    :    { type:Number, default:0,required:true,unique:true },
    createAt         :    { type:Date,default:Date.now },
    isActive         :    { type:Boolean,default:true }
});
module.exports=mongoose.model('version',version);