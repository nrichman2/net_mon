
var cp = require('child_process');
var fs = require('fs');
var mysql = require('mysql');
var moment = require('moment');
var progLog = require('./utils.js').progLog;
var https = require('https');


var config_file = require('./config.json');
config = JSON.parse(JSON.stringify(config_file));
var date = new Date();
console.log(date.getTime());

var options = {
  hostname : 'wisc.netbeezcloud.net',
  path: '/v1/nb_targets.json',
  port: 443,
  method: 'GET',
  cert: fs.readFileSync('/home/nrichman/Documents/net_mon/encrypt/*netbeezcloudnet.crt')
  //headers: {
    //'Authorization' : config.auth_key,
    //'Accept' : "application/json",
    //'API-VERSION' : 'v1'
    //},
};
var request = https.request(options, function(res){
  console.log(res.statusCode);
  console.log(res.headers);
});
//console.log(request);
