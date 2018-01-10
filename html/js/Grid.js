
var width = $(window).width();
var height = $(window).height();

var TEXTPAD = 5;
var svg;
var main;

var SIZE = 25;
/**
* Returns [targets, agents, matrix]
*/
function generateIndivData(){
  var tot = [];
  var targets = [];
  var agents = [];
  var matrix = [];
  for(var row = 0; row<9; row++){
    var baseGateway = 192168001001; //agent vars.
    var column = [];
    for(var col = 0; col<9; col++){
      var stat = Math.floor((Math.random()*1)+1);
      var baseTarget = 192168255255;    //target vars
      var baseName = 0;
      var targetObj = {"ip" : baseTarget, "name":"r-cssc-b116-"+baseName};
      var agentObj = {"gateway" : baseGateway};
      var obj = {
        "agentObj": agentObj,
        "targetObj": targetObj,
        "xpos": 0,
        "ypos": 0,
        "width": 0,
        "height": 0,
        "row" : 0,
        "col" : 0,
        "status": Math.floor((Math.random()*2))
      };

      baseTarget--;
      column.push(obj);
    }
    baseName++;
    targets.push(targetObj);
    agents.push(agentObj)
    baseGateway++;
    matrix.push(column);

  }
  tot.push(targets);
  tot.push(agents);
  tot.push(matrix);
  return tot;
}


function init(){
  svg = d3.select("#main")
    .append("svg")
    .attr("width",width)
    .attr("height",height);

  main = svg.append("g");

  var zoom = d3.zoom()//code from bl.ocks.org/shawnbot/6518285
    .scaleExtent([.4,5]).on("zoom",function(d){
      var e = d3.event;
      //zoom.translateBy(d,[tx, ty]);
      //console.log(["translate(" + [tx,ty]+")","scale("+e.scale+")"].join(" "));
      main.attr("transform", e.transform);
      //    "scale("+e.scale+")"].join(" "));
    });
  svg.call(zoom);

  update();
}

function update(){
  var dat = generateIndivData();
var animal_user = generateSubArea(main,"Animal User","animal-user",dat[1],dat[0],dat[2], [0,0]);
var a_bound = animal_user.node().getBBox();
var dat2 = generateIndivData();
var animal_mgmt = generateSubArea(main,"Animal Management","animal-mgmt",
  dat2[1],dat2[0],dat2[2], [a_bound.width,0]);
//var animal_mgmt = generateSubArea(main,"Animal User","animal-user",dat[1],dat[0],dat[2]);
}
