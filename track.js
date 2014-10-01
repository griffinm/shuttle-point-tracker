var http = require('http');
var MongoClient = require('mongodb').MongoClient;

// http://alewifeconnect.com/Services/JSONPRelay.svc/GetMapVehiclePoints?_=1412179672856
var vehiclePointOptions = {
  host: 'alewifeconnect.com',
  path: '/Services/JSONPRelay.svc/GetMapVehiclePoints?_=1412188811450',
  method: 'GET'
}

pointCallback = function(response){
  var data = '';

  response.on('data', function(chunk) {
    data += chunk;
  });

  response.on('end', function(){
    var obj = JSON.parse(data),
      items = obj.length;

    for(current=0; current < items; current++) {
      if (obj[current].VehicleID == 3) {
        writeToDb('points', obj[current]);
      }
    }

    
  });
};

writeToDb = function(collectionName, data) {
  MongoClient.connect('mongodb://localhost:27017/shuttle_dev', function(err, db) {
  if(err) throw err;

  var collection = db.collection(collectionName);

  collection.insert(data, function(err, docs){
      if(err) throw err;
      db.close();   
    });
  });
};

var request = http.request(vehiclePointOptions, pointCallback);
request.end();
