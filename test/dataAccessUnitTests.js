const expect = require('chai').expect;
const rewire = require('rewire');
const dataAccess = rewire('../data/dataAccess.js');
const nock = require('nock');
const testItemId = 14225185;
const response = {
        "itemId": 14225185,
        "parentItemId": 14225185,
        "name": "Test Item",
        "msrp": 129.99,
        "salePrice": 89,
        "upc": "841550034950",
        "categoryPath": "Test Path",
        "shortDescription": "A Short Decription",
        "longDescription": "A Long Description" };

describe('Calls API and initiates local database', function(){

    before(function(){
        //Mocks Network Call to Product API
        nock('http://api.walmartlabs.com/v1')
            .get(`/items/${testItemId}?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj`)
            .reply(200, response);
        
        //Mocks fs implementation or readFileSync
        let fsMock = {
            readFileSync: function(path){
                expect(path).to.equal('./data/data_file.csv')
                return testItemId;
            }
        }

        dataAccess.__set__("fs", fsMock);
    });
   
    it('Initializing DB should response into fresh local db', async function(){
       
        await dataAccess.initDb();
        
        let expected = response.itemId;
        let actual = dataAccess.availableItems[testItemId].id;
    
        expect(expected).to.equal(actual);
    });
});

describe('Second call to network for an existing item id avoids duplication', function(){
   
    before(function(){
        //Mocks Network Call to Product API
        nock('http://api.walmartlabs.com/v1')
            .get(`/items/${testItemId}?format=json&apiKey=kjybrqfdgp3u4yv2qzcnjndj`)
            .reply(200, response);
        
        //Mocks fs implementation or readFileSync
        let fsMock = {
            readFileSync: function(path){
                expect(path).to.equal('./data/data_file.csv')
                return testItemId;
            }
        }

        let existingItem = {'14225185': { id: 14225185, name: 'Test Item', shortDescription: 'A Short Decription', longDescription: 'A Long Description' }};
        
        dataAccess.__set__("fs", fsMock);
        dataAccess.__set__("methods.availableItems", existingItem);
    });
    
    it('Response with an existing id updates the existing item instead of creating duplicates', async function(){
        await dataAccess.initDb();
        expect(1).to.equals(Object.keys(dataAccess.availableItems).length);
    });
});