const  mongoose             = require('mongoose'),
       Config               = require('../../config'),
       Schema               = mongoose.Schema;

let Rating=Schema({
    userId:{type:Schema.Types.ObjectId,ref:'Users'},
    postId:{type:Schema.Types.ObjectId,ref:'Post'},
    rating:{type:Number,default:0.0},
    createAt:{type:Number,default:Date.now}
});
module.exports=mongoose.model('Rating',Rating);