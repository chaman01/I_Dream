'use strict';
const Services                          = require('../services'),
      UniversalFunctions                = require('../../utils/universalFunctions'),
      Config                            = require('../../config'),
      Models                            = require('../models'),
      NotificationManager               = require('../lib/NotificationManager'),
      TokenManager                      = require('./TokenManager');
let redis, io;
exports.connectSocket = async(server,redisClient)=>{
    redis=redisClient;
    io = require('socket.io')(server.listener);
    io.on('connection', async(socket) => {
        try{
        console.log(socket.handshake.query.accessToken,'sdgysdfguysuydgsuydfguysduysuyd')
        let decryptToken=await TokenManager.verifyForgotToken(socket.handshake.query.accessToken);
        console.log(decryptToken,'sdgysdfguysuydgsuydfguysduysuyd')
        let data = await TokenManager.verifyToken(decryptToken);
        console.log(data)

        if (!data.isValid) {
            await socket.emit('socketError',{success:0,msg:Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN,statusCode:401});
            return;
        }
        await redisClient.set(data&&data.data&&data.data._id.toString(),socket.id);
        await io.sockets.emit('offlineBroadcast',{userId:data.data._id,isOnline:true});
        await Services.DbOperations.update(Models.Users,{_id:data.data._id},{$set:{isOnline:true}},{lean:true,new:true})
        await socket.emit('socketConnected', {
            statusCode: 200,
            message: Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.SOCKET_CONNECTED,
            data: {socketId: socket.id}
        });


        socket.on('disconnect', async function () {
            let keys=await redis.keys('*');
            let user="";
            for(let i=0;i<keys.length;i++){
                let getValue=await redis.get(keys[i]);
                if(getValue == socket.id){
                    user=keys[i];
                    break;
                }
            }
            await io.sockets.emit('offlineBroadcast',{userId:user,isOnline:false});
            if(user){
                await redis.del(user.toString());
                await Services.DbOperations.update(Models.Users,{_id:user},{$set:{isOnline:false}},{lean:true,new:true})
            }
        });

        ////////////////chatting events//////////////////////////////

        socket.on('sendMessage',  async(data)=> {
            let chatData = {};
            if (data.audioUrl) {
                chatData.audioUrl = data.audioUrl;
                chatData.messageType = "AUDIO";
            }
            if (data.imageUrl) {
                chatData['imageUrl.original'] = data.imageUrl.original;
                chatData['imageUrl.thumbnail'] = data.imageUrl.thumbnail;
                chatData.messageType = "IMAGE"
            }
            if (data.videoUrl) {
                chatData['videoUrl.original'] = data.videoUrl.original;
                chatData['videoUrl.thumbnail'] = data.videoUrl.thumbnail;
                chatData.messageType = "VIDEO"
            }
            if (data.message) {
                chatData.message = data.message;
                chatData.messageType = "TEXT";
            }

            chatData.senderId = data.senderId;
            chatData.receiverId = data.receiverId;
            chatData.sentAt = data.sentAt;
            chatData.isDelivered = false;
            chatData.isRead = false;
            chatData.conversationId = [data.senderId, data.receiverId].sort().join('.');
            chatData.create_at = new Date();


            let populateOptions = [{
                path: "senderId",
                select: { _id: 1, fullName: 1, image: 1 },
                model: "user",
                match: {}
            }]

            let saveChat= await Services.DbOperations(Models.ChatRoom,chatData);

            let [getChatData,getSocketId, userData]=await Promise.all([
                Services.DbOperations.populateData(Models.Chatroom,{_id:saveChat._id},{},{},populateOptions),
                redis.get(data.receiverId),
                Services.DbOperations.getData(Models.Users, { "_id": data.receiverId }, {}, {})
            ]);
            await io.to(getSocketId).emit("messageFromServer", getChatData);
        })

        socket.on('acknowledgeMessage',async(data)=> {
            let messageDetail=await Services.DbOperations.findAndUpdate(Models.Chatroom,{_id:data.messageId},{isDelivered:true,isRead:true});
            if(!messageDetail)  await socket.emit('socketError',{success:0,msg:Config.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_ID,statusCode:400});
            let getSocketId = await redis.get(messageDetail.senderId);
            await io.to(getSocketId).emit("acknowledgeMessage", {isDelivered:true});
        })


        socket.on('typing',async(data)=>{
            let getSocketId = await redis.get(data.receiverId);
            await io.to(getSocketId).emit("typing", {senderId:data.senderId,isTyping:data.isTyping,receiverId:data.receiverId});
        })
    }
    catch(err){
        console.log(err,'sdgshdghsgdhsghdgshdghsgdhsgh')
        await socket.emit('socketError',err);
        return;
    }
  });
}







