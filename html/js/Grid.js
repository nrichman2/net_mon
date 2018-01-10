
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
        "status": 0
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
  var animal_user = generateSubArea(main.append("g"),"Animal User","animal-user",dat[1],dat[0],dat[2]);
}




var cellMake = function(cellObj){
  self = d3.select(this)
  if(cellObj.status == 1){ //test successful
    self.attr("class", "success");
  } else if(cellObj.status == 0){
    self.attr("class", "fail");
  } else {
    self.attr("class","unknown");
  }
}

var findGreatestLength = function(textObj){
  var rect = d3.select(this).node().getBBox();
  console.log(Math.cos(Math.PI/4));
  var h = rect.width*Math.cos(Math.PI/4)+TEXTPAD;
  if(h > upper_pad){
    upper_pad = h+TEXTPAD*4;
    console.log(rect.height);
    console.log(rect.height);
  }
}
init();
