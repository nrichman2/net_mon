var moment = require('moment');
var fs = require('fs');
module.exports.progLog =  function(program,message){
	   var toWrite = program+moment().format('MMM Do YYYY, hh:mm:ss')+': '+message+'\n';
	    fs.appendFileSync('/var/log/net_mon/net_mon.log',toWrite);
    }
