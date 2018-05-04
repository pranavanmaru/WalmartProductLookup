'use strict';

const hapi = require('hapi'),
      wreck = require('wreck'),
      fs = require('fs');

var methods = {
    availableItems : {},

    //initialize network call and in memory database
    initDb: async function(){
        var itemIds = this.getItemIds();
        var response = '';
        var data = {};

        for(var i=0; i<itemIds.length; i++){
            var itemId = itemIds[i];

            if(itemId === '')
                return;

            var requestUrl = `http://api.walmartlabs.com/v1/items/${itemId}?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj`;

            const { res, payload } = await wreck.get(requestUrl);
            response = JSON.parse(payload.toString());
            data = this.getItem(response);

            this.insertOrUpdateItem(data);
        }
    },

    //checks if item exists in data store and inserts if not
    insertOrUpdateItem: function(data){
        if(this.availableItems.hasOwnProperty('id'))
            return;

        var item = data;
        this.availableItems[data.id] = item;
    },

    //formats the data received from product api call
    getItem: function(response){

        var item = {
            id: response.itemId,
            name: response.name,
            shortDescription: response.shortDescription,
            longDescription: response.longDescription
        };

        return item;
    },

    //get itemIds from csv repository
    getItemIds: function(){
        var file = fs.readFileSync('./data/data_file.csv');
        var itemIds = file.toString().replace(/(\r\n|\n|\r)/gm,"").split(',');

        return itemIds;
    },
    
    //returns itemIds of matching products
    searchItem: function(term){
        
        var result = [];
        var itemForwardIndex = this.buildForwardIndex(term); 
        
        Object.entries(itemForwardIndex).forEach(([key, value]) => {
           if(value.searchHit)
               result.push(key);
        });
        
        return result; 
    },
    
    //builds forward index for search term
    buildForwardIndex: function(term){
    
        var result = {};
        var termCount = 0;
        var hit = false;
        var searchExpression = new RegExp("backpack", "g");        
        
        Object.entries(this.availableItems).forEach(([key, value]) =>
        {
            hit = value.name.toLowerCase().match(searchExpression);

            console.log(value.name);
            console.log(hit);
            
            var item = {
                id: key,
                searchHit: hit != null
            };
            
            result[key] = item;
        });
        
        return result;
    }
    
}

module.exports = methods;