//var http = require('http');
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

var mySQLget = function(con){


  //
  this.generateMatrix = function(targetList){
    var matrix = [];

    var column =0;
    targetList.forEach(function(target){
      var query = "select json_extract(agentids, '$[*]') from targets where id=";
      var id = target.id;
      query+= "\'"+id+"\';";
      console.log(column+" outer")
      con.query(query, function(err, rows){
        //pass list of the form for each target [{"test_id": , "agent_id": },...]
        //console.log(JSON.parse(rows));
        makeColumn(err, rows, matrix, column, id);
      });
      column++;
    });
    //console.log(matrix);
  }


  //Code from

  function async(arg, callback){
    setTimeout(function() {callback(arg);}, 200);

  }

  function final() {}
  function helper(con,query){
      var query = "select json_extract(agentids, '$[*]') from targets where id=";
    con.query
  }

  this.makeMat = function(matrix, index, list, con){

    var query = "select json_extract(agentids, '$[*]') from targets where id=";
    var id = list[index].id;
    query+= "\'"+id+"\';";
    console.log(id);
    if(index < list.length){
      con.query(query, function(err, rows){
        var weirdQuery = 'json_extract(agentids, \'$[*]\')';
        var list = [];
        try{
          //data returned is in rawdata stream json stringify turns that into json string, then need to parse
          //because mysql returns query and row, in list form, need to access element [0] and then the value
          //at the query [weirdQuery]
          list = JSON.parse(JSON.parse(JSON.stringify(rows))[0][weirdQuery]);
        } catch (err){
          progLog("[mySQLget] parsing JSON error");
        }
        matrix[index] = new Array(list.length);
        for(var j = 0; j<list.length; j++){

          list[j].target_id = id;
          matrix[index][j] = list[j];
        }
        var pass = index++;
        mySQLget.makeMat(matrix,pass,list,con);
      });
    }
  }

  function makeColumn(err, rows, matrix, column, id){
    console.log(column+" inner");
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

  }


  //String of areaname
  //callback to handle response
  this.getTargets = function(area, callback){
    //maybe dont need to select * possible just ip, or id
    var query = "select id from targets where area=\'"+area+"\';";
    con.query(query, function(err, rows){
      //passes rows into callback
      callback(err,rows);
    });
  }


  //String of areaname
  //callback to handle response
  this.getAgets = function(area, callback){
    //maybe dont need to select * possible just ip, or id
    var query = "select * from agents where area=\'"+area+"\';";
    con.query(query, function(err, rows){
      //passes rows into callback
      callback(err,rows);
    });
  }
}

var thisMySQL = new mySQLget(con);
var matrix = [];
thisMySQL.getTargets("animal", function(err, rows){
  thisMySQL.makeMat(matrix,0,JSON.parse(JSON.stringify(rows)),con);
  //thisMySQL.generateMatrix(JSON.parse(JSON.stringify(rows)));
});
