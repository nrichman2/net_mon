//Author: Nate Richman 2017

//This script gethers the netbeez agents from the dashboard
//And populate their name, ip, gateway, mac, and interface
//into a sql database


var cp = require('child_process');
var fs = require('fs');
var mysql = require('mysql');
var moment = require('moment');
var progLog = require('./utils.js').progLog;

function log(message){
	progLog('[getList] ');
}

var list;
function getList(){
	var quit=0;
	var  mine = cp.execSync('sh /home/nrichman/Documents/net_mon/shell/getList.sh');
	list = JSON.parse(mine);
	console.log(`${list}`);
}

function parseList(){
	if(list == null){
		//console.log('list not there');
		log('List not there');
		return;
	}

	var con = mysql.createConnection({
		host: "localhost",
		user: "netbeez_api",
		password: "netbeez",
		database: "netbeez"
	});

	//console.log(list);
	var agents = list;
	console.log(agents[0]);
	con.connect(function(err){	//connect to database
		if(err){
			log(err.message);
			throw err;
		}
		log("Connected to database");
		return;
	});
	//console.log(agents);
	for(var i=0; i<Object.keys(agents).length; i++){
		var agent = agents[i];
		var mac;
		var ip;
		var gateway;
		var query_temp = "INSERT INTO agents (mac, ip, gateway, interface,name) VALUES (";
		if(agent.network_interfaces.eth0){
			var query = query_temp
			name = '\''+agent.name+'\'';
			if(agent.network_interfaces.wlan0){
			mac = '\''+agent.network_interfaces.wlan0.mac+'\'';
			ip = '\''+agent.network_interfaces.wlan0.ip_address+'\'';
			gateway = '\''+agent.network_interfaces.wlan0.gateway+'\'';
			key = '\''+agent.network_interfaces.wlan0.key+'\'';
			query += mac+","+ip+","+gateway+","+key+", "+name+") ON DUPLICATE KEY UPDATE ip="+ip+", gateway="+gateway+", interface="+key+",name="+name+";";
			con.query(query, function(err, result){
				if(err){
					log(err.message);
					throw err;
				}
				log("Wrote to db");
			});
			}
			mac_e = '\''+agent.network_interfaces.eth0.mac+'\'';
			ip_e = '\''+agent.network_interfaces.eth0.ip_address+'\'';
			if(!ip_e) console.log("null")
			gateway_e = '\''+agent.network_interfaces.eth0.gateway+'\'';
			key_e = '\''+agent.network_interfaces.eth0.key+'\'';
			var query_e = query_temp + mac_e+","+ip_e+","+gateway_e+","+key_e+", "+name+") ON DUPLICATE KEY UPDATE ip="+ip_e+", gateway="+gateway_e+", interface="+key_e+", name="+name+";";

			con.query(query_e, function(err, result){
				if(err){
					log(err.message);
					throw err;
				}
				log("Wrote to db");
			});
		} else {
			mac = agent.network_interfaces.eth0.mac;
			ip = agent.network_interfaces.eth0.ip_address;
			gateway = agent.network_interfaces.eth0.gateway;
			query += mac+","+ip+","+gateway+");";
			console.log(query);
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
}
getList();
parseList();
  //Couldn't run execSync, so just had to add a delay.
