var http = require('http');
var mysql = require('mysql');
var progLog = require('./utils.js').progLog;
var sql_interact = require('./mySQLget.js');
var url = require('url');

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
var getter = new sql_interact.mySQLget(con);

var listener = function(request, response){
  progLog("[Server] new request from "+request.headers["user-agent"]);
  var myUrl = url.parse(request.url,true);
  console.log(myUrl.query);
  var area = myUrl.query.area;
  //Parses and sends response
  switch(myUrl.pathname){
    case "/agents.json":
      response.writeHead('200', {'Content-type': 'application/json'});

      getter.getAgents(area,function(data){
        console.log(rows);
      });
      response.end("{\"agents\":\"not done yet\"}");
      break;
    case "/targets.json":
      response.writeHead('200', {'Content-type': 'application/json'});
      getter.getAllTargetIds(function(data){
        console.log(data);
      })
      //getter.getTargets(area, function(data){
      //  response.end(data);
      //});

      break;
    case "/matrix.json":
      response.writeHead('200', {'Content-type': 'application/json'});

      getter.getTargetIds(area, function(data){
        getter.generateMatrix(data, function(matrix){
          response.end(JSON.stringify(matrix));
        });
      });
      break;
    default:
      response.writeHead('404', {'Content-type': 'text/html'});
      response.end("<H1>Not Found or implemented yet</h1>");
      break;
  }

  //getter.
  //agents = getAgents(function(err, rows){
  //  progLog("[Server] responding with agents JSON");
  //  response.end(JSON.stringify(rows));
  //});

}
const port = 4000;
var server = http.createServer(listener);


server.listen(port, function(err){
  if(err){
    progLog("[Server] error");
  }

  console.log(`[Server] listening on ${port}`);
});
