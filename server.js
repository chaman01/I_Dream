'use strict'
const Hapi             =      require('hapi'),
      Plugins          =      require('./plugins'),
      route            =      require('./app/routes'),
      Path             =      require('path'),
      Handlebars       =      require('handlebars'),
      socket           =      require('./app/lib/SocketManager'),
      redis            =      require('async-redis'),
      redisClient      =      redis.createClient({host : 'localhost', port : 6379}),
      Bootstrap        =      require('./utils/bootstrap'),
      mongoose         =      require('mongoose');
                              require('dotenv').config();
let server=new Hapi.Server({port:process.env.PORT,host:process.env.HOST,routes:{cors:true}});
(async ()=>{
  console.log('social module test')
  mongoose.connect(process.env.DB_URL,{useNewUrlParser:true,useCreateIndex:true});
  mongoose.connection.on('error',function(err){
    console.log("mongo db connection terminate "+ err);
    process.exit();
  });
  mongoose.connection.on('open',()=>{
    console.log('database connected successfully');
  });
  await server.register(Plugins);
  console.log("==================================")
  await server.views({engines: {html:Handlebars},relativeTo: __dirname,path: './views'});
  await server.route(route);
  await server.start();
  await Bootstrap.bootstrapAdmin();
  socket.connectSocket(server,redisClient);
  console.log(`server connected sucessfully on port ${process.env.PORT}`);
})()
