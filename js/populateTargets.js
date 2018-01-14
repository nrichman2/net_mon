
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
function getList(callback){
  var con = mysql.createConnection({
    host: "localhost",
    user: config.username,
    password: config.password,
    database: config.database
  });
  con.connect(function(err){	//connect to database
    if(err){
      progLog("[Server] "+err.message);
      throw err;
    }
    console.log("connected");
    progLog("[Server] Connected to database");
    return;
  });

  var options = {
    hostname : 'wisc.netbeezcloud.net',
    path: '/v1/nb_targets.json',
    cert: fs.readFileSync('/home/nrichman/Documents/net_mon/encrypt/*.netbeezcloud.pem'),
    headers: {
      'Authorization' : config.auth_key,
      'Accept' : "application/json",
      'API-VERSION' : 'v1'
      },
  };
  var request = https.get(options, function(res){
  //  console.log(body);
    res.setEncoding('utf8');
    res.on("data", function(d){
      callback(d);
      return;
    });
  });
}
var parseList = function(d){
  var list = JSON.parse(d);
  var targets = list.targets;

  var id = -1;    //Unique
  var name = "";
  var ip = ""; //Unique
  var test_template = [];
  var agents = [];
  var query = "INSERT INTO targets (id, name, ip, agents) VALUES ("
  for(var i=0; i<targets.length;i++){
    agents = targets[i].agent_ids;
    test_template = targets[i].nb_test_templates;
    test_template.forEach(function(d){

      if(d.heir_type.equalsIgnoreCase("pingtemplate")){
        name = d.label;
        id = d.id;
        ip = d.target;
        query+= name+","+id+","+ip+","+agents+");" //agents is JSON datatype

        con.query(query, function(err, result){
					if(err){
						log(err.message);
						throw err;
					}
					proLog("[populateTargets] Wrote to db");
				});
      }
    });
  }
  console.log(targets);
  return;
}
getList(parseList);

//console.log(request);
