
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

  var res = cp.execSync("sh /home/nrichman/Documents/net_mon/shell/getTargets.sh");
  list = JSON.parse(res);
  //console.log(list);
  parseList(list, con);
//  var options = {
//    hostname : 'wisc.netbeezcloud.net',
//    path: '/v1/nb_targets.json',
//    cert: fs.readFileSync('/home/nrichman/Documents/net_mon/encrypt/*.netbeezcloud.pem'),
//    headers: {
//      'Authorization' : config.auth_key,
//      'Accept' : "application/json",
//      'API-VERSION' : 'v1'
//      },
//  };
//  var request = https.get(options, function(res){
  //  console.log(body);
//  var list = [];
//    res.setEncoding('utf8');
//    res.on("data", function(d){
      //list = JSON.parse(d);
      //console.log(list);
//      callback(d);
//    });
//  });
}
function parseList(list, db){
  console.log(list);

  var targets = list.targets;
  var id = -1;    //Unique
  var name = "";
  var ip = ""; //Unique
  var test_template = [];
  var agents = [];

  var newDate = new Date();
  console.log(newDate.getTime()-date.getTime());
  for(var i=0; i<targets.length;i++){
    agents = targets[i].agent_ids;
    test_template = targets[i].nb_test_templates;
    //console.log(test_template[i]);
  for(j = 0; j< Object.keys(test_template).length; j++){
      var query = "INSERT INTO targets (id, name, ip, agents) VALUES ("
      var d = test_template[Object.keys(test_template)[j]];
      if(d.heir_type == "PingTemplate"){
        name = d.label;
        id = d.id;
        ip = d.target;
        query+= name+","+id+","+ip+","+agents+");" //agents is JSON datatype

        db.query(query, function(err, result){
					if(err){
						progLog("[populateTargets] "+err.message);
						throw err;
					}
					progLog("[populateTargets] Wrote to db");
				});
      }
    }
  }
  //console.log(targets);
}
getList();

//console.log(request);
