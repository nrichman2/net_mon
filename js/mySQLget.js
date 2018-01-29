//var http = require('http');
var mysql = require('mysql');
var progLog = require('./utils.js').progLog;

module.exports.mySQLget = function(con){

  //generate matrix of agents and targets for one area, takes area target list and a callback from httpServer
  this.generateMatrix = function(targetList, callback){
    var matrix = [];
    var query = "select json_extract(agentids, '$[*]'),id from targets";
    con.query(query, function(err, rows){

        var weirdQuery = 'json_extract(agentids, \'$[*]\')';
        var list = JSON.parse(JSON.stringify(rows));

        list.forEach(function(datum, i){

          var tests = JSON.parse(datum[weirdQuery]);
          var id = datum['id'];
          matrix[i] = new Array(tests.length);

          tests.forEach(function(test,j){
            test.id = id;
            matrix[i][j] = test;
          });

        });
        callback(matrix);
    });
  }

  //String of areaname
  //callback to handle response
  this.getTargetIds = function(area, callback){
    //maybe dont need to select * possible just ip, or id
    var query = "select id from targets where area=\'"+area+"\';";
    con.query(query, function(err, rows){
      //passes rows into callback
      callback(JSON.stringify(rows));
    });
  }
  this.getTargets = function(area, callback){
    //maybe dont need to select * possible just ip, or id
    var query = "select * from targets where area=\'"+area+"\';";
    con.query(query, function(err, rows){
      //passes rows into callback
      callback(JSON.stringify(rows));
    });
  }

  //String of areaname
  //callback to handle response
  this.getAgents = function(area, callback){
    //maybe dont need to select * possible just ip, or id
    var query = "select * from agents where area=\'"+area+"\';";
    con.query(query, function(err, rows){
      //passes rows into callback
      console.log(rows);
      callback(err,rows);
    });
  }

  this.getAllAgents = function(callback){}

 Need to figure this out.
  this.getAllTargetIds = function(callback){
    var query = "select id,area from targets;"
    con.query(query, function(err, rows){
      var fullList = [];
      var list = JSON.parse(JSON.stringify(rows));
      list.forEach(function(datum){
        fullList[datum.area] = new Array();
        fullList[datum.area].push(datum);
      });
      callback(fullList);
    });
  }
  this.getAllTargets = function(callback){
    var query = "select * from targets;"
    con.query(query, function(err, rows){
      //console
    });
  }
  this.getAllMatrix = function(targetList,callback){}
}
