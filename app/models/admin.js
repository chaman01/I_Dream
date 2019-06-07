const mongoose          = require('mongoose'),
      Schema            = mongoose.Schema;

let LoginAttempts = new Schema({
    timestamp: {type: Date, default: Date.now},
    validAttempt: {type: Boolean, required: true},
    ipAddress: {type: String, required: true},
    deviceType:{type:String,default:''}
});
let Admins = new Schema({
    email: {type: String, trim: true, unique: true, index: true},
    name:{type:String,default:""},
    isActive: {type:Boolean, required:true, default:false},
    accessToken: {type: String, trim: true, index: true, unique: true, sparse: true},
    password: {type: String, required:true},
    loginAttempts: [LoginAttempts]
},{
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

module.exports = mongoose.model('Admins', Admins);
