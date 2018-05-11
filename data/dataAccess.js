'use strict';

const hapi = require('hapi'),
      wreck = require('wreck'),
      fs = require('fs');

const methods = {
    availableItems : {},

    //initialize network call and in memory database
    initDb: async function(){
        const itemIds = this.getItemIds();
        let response = '';
        let data = {};

        for(var i=0; i<itemIds.length; i++){
            let itemId = itemIds[i];

            if(itemId === '')
                return;

            let requestUrl = `http://api.walmartlabs.com/v1/items/${itemId}?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj`;

            const { res, payload } = await wreck.get(requestUrl);
            response = JSON.parse(payload.toString());
            data = this.getItem(response);

            this.insertOrUpdateItem(data);
        }
    },

    //checks if item exists in data store and inserts if not
    insertOrUpdateItem: function(data){
        if(this.availableItems.hasOwnProperty(data.id))
            return;

        //creating new item
        let item = data;
        this.availableItems[data.id] = item;
    },

    //formats the data received from product api call
    getItem: function(response){
        
        let item = {
            id: response.itemId,
            name: response.name,
            shortDescription: response.shortDescription,
            longDescription: response.longDescription
        };

        return item;
    },

    //get itemIds from csv repository
    getItemIds: function(){
        let file = fs.readFileSync('./data/data_file.csv');
        let itemIds = file.toString().replace(/(\r\n|\n|\r)/gm,"").split(',');
        
        return itemIds;
    },
    
    //returns itemIds of matching products
    searchItem: function(term){
        
        let itemIds = [];
        let result = {};
        const itemForwardIndex = buildForwardIndex(term); 
        
        Object.entries(itemForwardIndex).forEach(([key, value]) => {
           if(value.searchHit)
               itemIds.push(key);
        });
        
        result["itemIds"] = itemIds;
        return result;
    }
}

//builds forward index for search term
function buildForwardIndex(term){
    
    let result = {};
    let hit = false;
    const searchExpression = new RegExp(term.toLowerCase().toString(), "g");  

    Object.entries(methods.availableItems).forEach(([key, value]) =>
    {
        hit = searchExpression.test(value.name.toLowerCase()) ||
            searchExpression.test(value.shortDescription.toLowerCase()) ||
            searchExpression.test(value.longDescription.toLowerCase());
        
        let item = {
            id: key,
            searchHit: hit
        };

        result[key] = item;
    });

    return result;
}

module.exports = methods;