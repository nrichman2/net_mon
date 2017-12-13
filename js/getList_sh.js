var cp = require('child_process');
var fs = require('fs');
var mysql = require('mysql');
var list;
function getList(){
	var quit=0;
	var  mine = cp.exec('sh /home/nrichman/Documents/net_mon/shell/getList.sh',
  	(error, stdout, stderr) => {
    	list = JSON.parse(stdout);
    	//console.log(`${stdout}`);
			//console.log(`${stderr}`);
    });

}
function parseList(){
	if(list ==null){
		console.log('list not there');
		return;
	}

	var con = mysql.createConnection({
		host: "localhost",
		user: "netbeez_api",
		password: "netbeez",
		database: "netbeez"
	});

	//console.log(list);
	var agents = list.agents;
	//console.log(agents[0]);
	con.connect(function(err){
			if(err) throw err;
			//console.log("connected");
			return;
		});
		//console.log(agents);
		for(var i=1; i<Object.keys(agents).length; i++){
			var agent = agents[i];
			var mac;
			var ip;
			var gateway;
			var query = "INSERT INTO agents (mac, ip, gateway) VALUES (";
			if(agent.network_interfaces.wlan0){
				mac = '\''+agent.network_interfaces.wlan0.mac+'\'';
				ip = '\''+agent.network_interfaces.wlan0.ip_address+'\'';
				gateway = '\''+agent.network_interfaces.wlan0.gateway+'\'';
				query += mac+","+ip+","+gateway+") ON DUPLICATE KEY UPDATE ip="+ip+", gateway="+gateway+";"
				console.log(query);
				con.query(query, function(err, result){
						if(err) throw err;
						//console.log(result);
					});
			} else {
				mac = agent.network_interfaces.eth0.mac;
				ip = agent.network_interfaces.eth0.ip_address;
				gateway = agent.network_interfaces.eth0.gateway;
				query += mac+","+ip+","+gateway+");";
				console.log(query);
				con.query(query, function(err, result){
						if(err) console.log(err);
						//console.log(result);
					});
			}
		}
	con.query("SHOW FIELDS IN agents", function(err, result){
			if(err) throw err;
			console.log(result);
		});
	con.end();
}
getList();
setTimeout(parseList, 1000);
