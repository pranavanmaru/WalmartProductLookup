'use strict';

const hapi = require('hapi'),
      fs = require('fs'),
      wreck = require('wreck'),
      joi = require('joi'),
      boom = require('boom'),
      dataAccess = require('./data/dataAccess.js');

const server = new hapi.server({
    
    host: 'localhost',
    port: 3000
});

var options = {
    ops:{
        interval: 1000
    },
    reporters: {
        myFileReporter: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ ops: '*' }]
        }, {
            module: 'good-squeeze',
            name: 'SafeJson'
        }, {
            module: 'good-file',
            args: ['./logs/walmart-api-logs']
        }]
    }
};

var availableItems = {};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

const init = async () => {
    
    await server.register({
        plugin: require('good'),
        options: options
    });
    
    //Routes
    //Root Acess Route
    server.route({
        method: 'GET',
        path: '/',
        handler: (request, reply)=>{
            
            return "Walmart Labs is Cool";
        }
    });
    
    try 
    {
        dataAccess.initDb();
    }
    catch(err) 
    {
        console.log(">>>> DB INITIALIZATION ERROR: ");
        console.log(">>>> " + err);
    }
        
    //Start Server
    await server.start();
    console.log(`Server Running at: ${server.info.uri}`);
}

init();
