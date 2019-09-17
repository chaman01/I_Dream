'use strict';

const mongoose                      =              require('mongoose'),
     Service                        =              require('../app/services'),
     Models                         =              require('../app/models'),
     async                          =              require('async-await'),
     Config                         =              require('../config'),
     jwt                            =              require('jsonwebtoken'),
     universalFunction              =              require('./universalFunctions');


exports.bootstrapAdmin = async()=> {
    try{
        console.log("inside boot strap")
        let adminData1 = {
            email: 'test@idream.com',
            superAdmin: true,
            password: 'idream',
            userName: 'test'
        };
        let adminData2 = {
            email: 'admin@idream.com',
            superAdmin: true,
            password: 'idream',
            userName: 'admin'
        };

        await Promise.all([
            insertData(adminData1.email, adminData1),
            insertData(adminData2.email, adminData2),
        ]);
    }catch(err){
        console.log(err)
    }

};




async function  insertData (email, adminData){
    try{
        let criteria = {
            email: email
        };
        let isAdmin = await Service.DbOperations.findOne(Models.Admins,criteria, {}, {} );
        if(!isAdmin){
            adminData.password = await universalFunction.createHash(adminData.password);
            await Service.DbOperations.saveData(Models.Admins,adminData)
        }
        console.log('Bootstrapping finished for ' + email);
    }catch(err){
        console.log(err);
    }
}

async function addGenderInDb(data) {
    try{
        for(let i=0 ;i<data.length;i++){
            let criteria={
                "name.englishName":data[i].name.englishName,
                "type":data[i].type,
                "name.arabicName":data[i].name.arabicName
            }
            let isGender = await Service.DbOperations.findOne(Models.CommonService,criteria, {}, {} );
            if(!isGender){
                await Service.DbOperations.saveData(Models.CommonService,{"name":data[i].name,type:Config.APP_CONSTANTS.COMMON_SERVICE_TYPE.GENDER})
            }
            console.log('Bootstrapping finished for ' + data[i].name);
        }

    }catch(err){
        console.log(err);
    }
}




