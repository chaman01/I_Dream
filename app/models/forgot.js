const  mongoose             = require('mongoose'),
       Schema               = mongoose.Schema;
let forgot = Schema({
   email:{type:String,required:true,trim:true,index:true},
   forgotId:{type:String,required:true,index:true},
   isActive:{type:Boolean,default:true},
   
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    } 
});

module.exports = mongoose.model("forgot", forgot);