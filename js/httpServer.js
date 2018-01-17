var http = require('http');
var mysql = require('mysql');
var progLog = require('./utils.js').progLog;

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
    progLog("[Server] "+err.message);
    throw err;
  }
  console.log("connected");
  progLog("[Server] Connected to database");
  return;
});
function getAgents(callback){
  var query = "SELECT * FROM agents"
  var agents = "";
  //todo create tables in mysql for vlans
  con.query(query, function(err, rows){
    callback(err, rows);
  });
}



var listener = function(request, response){
  var url = request.url;
  var agents = "";
  response.writeHead('200', {'Content-type': 'application/json'});
  agents = getAgents(function(err, rows){
    progLog("[Server] responding with agents JSON");
    response.end(JSON.stringify(rows));
  });

}
const port = 4000;
var server = http.createServer(listener);


server.listen(port, function(err){
  if(err){
    progLog("[Server] error");
  }

  console.log(`[Server] listening on ${port}`);
});
