//Author: Nate Richman 2017

//This script gethers the netbeez agents from the dashboard
//And populate their name, ip, gateway, mac, and interface
//into the sql database

var date = new Date();
var cp = require('child_process');
var fs = require('fs');
var mysql = require('mysql');
var moment = require('moment');
var progLog = require('./utils.js').progLog;
var https = require('https');


function log(message){
	progLog('[populateAgents] ');
}

var list;
function getList(callback){
	//var q
	//var  mine = cp.execSync('sh /home/nrichman/Documents/net_mon/shell/getList.sh');
	//list = JSON.parse(mine);
	//var finished = new Date();
	//console.log("got list:"+(finished.getTime()-date.getTime()));
  var config_file = require("./config.json");
  var config = JSON.parse(JSON.stringify(config_file));
  var con = mysql.createConnection({
    host: "localhost",
    user: config.username,
    password: config.password,
    database: config.database
  });

  con.connect(function(err){	//connect to database
    if(err){
      log(err.message);
      throw err;
    }
    log("Connected to database");
    return;
  });

  var options = {
    hostname : 'wisc.netbeezcloud.net',
    path: '/agents.json',
    cert: fs.readFileSync('/home/nrichman/Documents/net_mon/encrypt/*.netbeezcloud.pem'),
    headers: {
      'Authorization' : config.auth_key,
      'Accept' : "text/html",
      'API-VERSION' : 'v1'
      },
  };
  var request = https.get(options, function(res){

    var list = [];
    var rawData = '';
    res.setEncoding('utf8');
    res.on("data", function(chunk){

      rawData += chunk;
    });
    res.on('end', function(){
      try{
        list = JSON.parse(rawData);
        callback(list,con);
      } catch(e){
        log("Reading from netbeez error");
        throw e;
      }
    })
  });

}

function parseList(list,con){
	if(list == null){
		//console.log('list not there');
		log('List not there');
		return;
	}


	var agents = list;

	//var ageLength = agents.id ? 1 : Object.keys(agents).length;

	//for(var i=0; i<ageLength-1; i++){
  //console.log(agents);
  for(var i =0; i<agents.length; i++){
		var mac;
		var ip;
		var gateway;
		var query_temp = "INSERT INTO agents (mac, ip, gateway, vlan, id, name, interface) VALUES (";
		var vlan;
		var name;
		var id;

		//Check if only one agent
		//var agent = agents.id ? agents : agents[i];

    var agent = agents[i];
		name = '\''+agent.name+'\'';
		id = agent.id;
		if(agent.network_interfaces.wlan0){
			name = '\''+agent.name+'\'';

			//eth0 and wlan0 connected: Wlan0 block
				//mac = '\''+agent.network_interfaces.wlan0.mac+'\'';
				//ip = '\''+agent.network_interfaces.wlan0.ip_address+'\'';
				//gateway = '\''+agent.network_interfaces.wlan0.gateway+'\'';
				//key = '\''+agent.network_interfaces.wlan0.key+'\'';
				//vlan = 99999; //default //agent.network_interfaces.wlan0.gateway.split('.')[3]; //takes last grouping of ip.

				//query += mac+","+ip+","+gateway+","+key+", "+name+") ON DUPLICATE KEY UPDATE ip="+ip+", gateway="+gateway+", interface="+key+",name="+name+";";
      //  console.log(query);
        //con.query(query, function(err, result){
				//	if(err){
				//		log(err.message);
				//		throw err;
				//	}
				//	console.log(query);
				//	log("Wrote to db");
			//	});
			//}
			//eth0 block
			mac = '\''+agent.network_interfaces.wlan0.mac+'\'';
			ip = '\''+agent.network_interfaces.wlan0.ip_address+'\'';
			gateway = '\''+agent.network_interfaces.wlan0.gateway+'\'';
			key = '\''+agent.network_interfaces.wlan0.key+'\'';
			vlan = "99999";

			var query = query_temp + mac+","+ip+","+gateway+", "+vlan+","+id+", "+name+", "+key+") ON DUPLICATE KEY UPDATE ip="+ip+", gateway="+gateway+", interface="+key+", name="+name+", vlan="+vlan+";";
			con.query(query, function(err, result){
				if(err){
					log(err.message);
					throw err;
				}
				log("Wrote to db");
			});

		} else { //eth0
			mac = '\''+agent.network_interfaces.eth0.mac+'\'';
			ip = '\''+agent.network_interfaces.eth0.ip_address+'\'';
			gateway = '\''+agent.network_interfaces.eth0.gateway+'\'';
			key = '\''+agent.network_interfaces.eth0.key+'\'';
			vlan = "99999";

			var query = query_temp + mac+","+ip+","+gateway+", "+vlan+","+id+", "+name+", "+key+") ON DUPLICATE KEY UPDATE ip="+ip+", gateway="+gateway+", interface="+key+", name="+name+", vlan="+vlan+";";
			con.query(query, function(err, result){
				if(err){
					log(err.message);
					throw err;
				}
				log("Wrote to db");
			});
		}
	}
	con.end();
	var newDate = new Date();
	console.log(newDate.getTime()-date.getTime());
}
getList(parseList);
