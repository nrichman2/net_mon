var mysql = require('mysql');
var progLog = require('./utils.js').progLog;

var config_file = require('./config.json');
config = JSON.parse(JSON.stringify(config_file));
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



function generateColumnAsync(err, rows, matrix, column, id, callback){
  var list = [];
  var weirdQuery = 'json_extract(agentids, \'$[*]\')';
  try{
    //data returned is in rawdata stream json stringify turns that into json string, then need to parse
    //because mysql returns query and row, in list form, need to access element [0] and then the value
    //at the query [weirdQuery]
    list = JSON.parse(JSON.parse(JSON.stringify(rows))[0][weirdQuery]);
  } catch (err){
    progLog("[mySQLget] parsing JSON error");
  }

  for(var j = 0; j<list.length; j++){
    matrix[column] = new Array(list.length);
    list[j].target_id = id;
    matrix[column][j] = list[j];
  }

  setTimeout(callback, 200);
}
function doResult(matrix){
  console.log(matrix);
}
function generateMatrix(targetList){
  var matrix = [];
  var column = 0;
  for(var i = 0; i<targetList.length; i++){
    var query = "select json_extract(agentids, '$[*]') from targets where id=";
    var id = targetList[i].id;
    console.log(column);
    query+= "\'"+id+"\';";
    con.query(query, setTimeout(function(err, rows){
      console.log(column);
      generateColumnAsync(err, rows, matrix, column, id, function(column){
        matrix.push(column);
        if(matrix.length == targetList.length)
          doResult(matrix);
      });
    }, 200));
    column++;
  }
}




function getTargets(area, callback){
  //maybe dont need to select * possible just ip, or id
  var query = "select id from targets where area=\'"+area+"\';";
  con.query(query, function(err, rows){
    //passes rows into callback
    callback(err,rows);
  });
}
getTargets("animal", function(err, rows){
  generateMatrix(JSON.parse(JSON.stringify(rows)));
})
