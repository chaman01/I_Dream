const  mongoose             = require('mongoose'),
       Config               = require('../../config'),
       Schema               = mongoose.Schema;
let bank = Schema({
    bankNameArabic: {type: String, trim: true, sparse:true},
    bankNameEnglish: {type: String, trim: true, sparse:true},
    branchArabic: {type: String, trim: true, sparse:true},
    branchEnglish: {type: String, trim: true, sparse:true},
    accountNo: {type: String, trim: true, index:true, unique:true},
    IFSC: {type: String, trim: true, index:true},
    isBlocked:{type:Boolean, default:false},
    isDeleted:{type:Boolean,default: false},
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model("bank", bank);
