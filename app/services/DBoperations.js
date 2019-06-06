'use strict';

let saveData = function(model,data){
    return new model(data).save();
};

let getData = function (model, query, projection, options) {
    return model.find(query, projection, options);
};

let findOne = function (model, query, projection, options) {
    return model.findOne(query, projection, options);
};

let findAndUpdate = function (model, conditions, update, options) {
    return  model.findOneAndUpdate(conditions, update, options);
};

let findAndRemove = function (model, conditions, update, options) {
    return  model.findOneAndRemove(conditions, options);
};

let update = function (model, conditions, update, options) {
    return model.update(conditions, update, options);
};

let remove = function (model, condition) {
    return model.remove(condition);
};
/*------------------------------------------------------------------------
 * FIND WITH REFERENCE
 * -----------------------------------------------------------------------*/
let populateData = function (model, query, projection, options, collectionOptions) {
    return model.find(query, projection, options).populate(collectionOptions).exec();
};


let count = function (model, condition) {
    return model.count(condition);
};
/*
 ----------------------------------------
 AGGREGATE DATA
 ----------------------------------------
 */
let aggregateData = function (model, aggregateArray,options) {

    let aggregation = model.aggregate(aggregateArray);

    if(options)
        aggregation.options = options;

    return aggregation.exec();
};

let insert = function(model, data, options){
    return model.collection.insert(data,options);
};

let insertMany = function(model, data, options){
    return model.collection.insertMany(data,options);
};

let aggregateDataWithPopulate = async function (model, group, populateOptions,options){
    try {
        let aggregateData;
        if(options !==undefined){
            aggregateData = await model.aggregate(group).option(options);
        }
        else{
            aggregateData = await model.aggregate(group);
        }
       
        let populateData = await model.populate(aggregateData,populateOptions);
        return populateData;
    } catch (err) {
        return err;
    }
};

let bulkFindAndUpdate= function(bulk,query,update,options) {
   return bulk.find(query).upsert().update(update,options);
};

let bulkFindAndUpdateOne= function(bulk,query,update,options) {
   return bulk.find(query).upsert().updateOne(update,options);
};


module.exports = {
    saveData : saveData,
    getData: getData,
    update : update,
    remove : remove,
    insert : insert,
    insertMany:insertMany,
    count  : count,
    findOne: findOne,
    findAndUpdate : findAndUpdate,
    findAndRemove : findAndRemove,
    populateData : populateData,
    aggregateData : aggregateData,
    aggregateDataWithPopulate: aggregateDataWithPopulate,
    bulkFindAndUpdate : bulkFindAndUpdate,
    bulkFindAndUpdateOne : bulkFindAndUpdateOne
};