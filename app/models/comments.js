const  mongoose             = require('mongoose'),
    Config                  = require('../../config'),
    Schema                  = mongoose.Schema;

let commentsRating = Schema({
    toUserId:{type:Schema.Types.ObjectId,ref:'user'},
    byUserId:{type:Schema.Types.ObjectId,ref:'user'},
    rating:{type:Number,default:0},
    comment:{type:String,default:""},
    isActive:{type:Boolean,default:true},
    isDeleted:{type:Boolean,default:false},
    report:{type:String,default:""},
    isReported:{type:Boolean,default:false}
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});
module.exports = mongoose.model("commentsRating", commentsRating);
