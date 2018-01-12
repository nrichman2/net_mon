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
  progLog("[Server] Connected to database");
  return;
});
function getAgents(){
  var query = "SELECT * FROM agents"
  var agents=[];
  //todo create tables in mysql for vlans
  con.query(query, function(err, result){
    if(err){
      progLog("[Server] "+err.message);
      throw err;
    }
    agents = JSON.parse(JSON.stringify(result));
    console.log(JSON.parse(JSON.stringify(result))[0]);
  });
  return "1";
}

var listener = function(request, response){
  var url = request.url;
  var agents = getAgents();
  response.end("<h1>Hello, World!</h1>");
}
const port = 4000;
var server = http.createServer(listener);


server.listen(port, function(err){
  if(err){
    progLog("[Server] error");
  }

  console.log(`[Server] listening on ${port}`);
});
