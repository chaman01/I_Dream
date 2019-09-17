const Inert             =       require('inert'),
      Vision            =       require('vision'),
      HapiSwagger       =       require('hapi-swagger'),
      authToken         =       require('./auth-token'),
      Pack              =       require('../package'),
      swaggerOptions    =       {info: { title: 'I Dream Test', version: Pack.version}};

module.exports = [
   Inert,
   Vision,
   {
       plugin: HapiSwagger,
       options: swaggerOptions
   },
   {
       plugin: authToken,
       name: authToken.plugin.name
   }
];