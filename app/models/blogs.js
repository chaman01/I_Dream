const  mongoose             = require('mongoose'),
    Config                  = require('../../config'),
    Schema                  = mongoose.Schema;
let pictures={
    original:{type:String,required:true},
    thumbnail:{type:String,require:true}
}

let blogs = Schema({
    title:{englishTitle:{type:String,required:true},arabicTitle:{type:String,required:true}},
    description:{englishDescription:{type:String,required:true},arabicDescription:{type:String,required:true}},
    pictures:[pictures],
    isActive:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false}
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});
module.exports = mongoose.model("blogs", blogs);
