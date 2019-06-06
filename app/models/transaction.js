const  mongoose                = require('mongoose'),
       Config                  = require('../../config'),
       Schema                  = mongoose.Schema;
let transaction = Schema({
    requestId:{type:Schema.Types.ObjectId,ref:'requests'},
    classId:{type:Schema.Types.ObjectId},
    paymentNotes:{type:String,default:""},
    status:{type:Number,default:Config.APP_CONSTANTS.TRANSACTION_STATUS.PAID,
        enum:[
            Config.APP_CONSTANTS.TRANSACTION_STATUS.REFUNDED,
            Config.APP_CONSTANTS.TRANSACTION_STATUS.PAID
        ]
    }
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model("transaction", transaction);
