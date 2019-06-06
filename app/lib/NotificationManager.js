'use strict';
const FCM        = require('fcm-node'),
      Models     = require('../models'),
      Services   = require('../services');
let fcm = new FCM("AAAAfDWFfxo:APA91bEO7otN3rD5Ej-twNdZXHeV3lxN5Ry4syqe5YwosQeiAt2bZ6Gtwk6YWaEpP1LbmI9lYfHGSTvVKJ54BRniYiyOKbKGHu6khb3oQQypug3EGHSDPNylYlJvBbSyIAhaoM4P-GjM");
exports.sendNotification=async(deviceToken,dataToPush)=>{
    try{
        let message = {
            registration_ids:deviceToken,
            collapse_key: 'demo',
            notification: {
                title:dataToPush.title,
                body: dataToPush.message,
                sound:'default',
                badge:1,
                data:dataToPush
            },
            data:{
                title:dataToPush.title,
                body: dataToPush.msg,
                data:dataToPush,
                sound:'default',
                badge:1,
            },
            priority: 'high'
        };

        fcm.send(message, function(err, result){
            if (err) {
               console.log(err,'===================error=========================');
            } else {
               console.log(result,'===================result=========================');
            }
        });

    }catch(err){
        throw err;
    }
}
