
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

function makeArea(name, base){
  var dat1 = generateIndivData();
  var dat2 = generateIndivData();
  var container =main.append("g")
    .attr("id",name.toLowerCase()+"-container")
    .attr("transform","translate("+base[0]+","+base[1]+")");
  var title = container.append("text")
    .text(name)
    .attr("text-anchor","middle")
    .attr("class","area-title");


  var title_bound = title.node().getBBox();

  var area = container.append("g")
    .attr("id",name.toLowerCase())
    .attr("transform","translate("+0+","+(title_bound.height)+")");
  var user = generateSubArea(area, name+" User",name.toLowerCase()+"-user",dat1[1],dat1[0],dat1[2], [0,0]);
  var u_bound = user.node().getBBox();

  var user = generateSubArea(area, name+" Management",name.toLowerCase()+"-mgmt"
    ,dat2[1],dat2[0],dat2[2], [u_bound.width/2,0]);
  title.attr("transform","translate("+container.node().getBBox().width/2.5+","+0+")");
console.log(container.node().getBBox().width);

  return d3.select("#"+name.toLowerCase());
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
  var animal = makeArea("Animal",[0,0]);
  var animal_bound = animal.node().getBBox();
  main.append("rect")
    .attr("x","0")
    .attr("y","0")
    .attr("height",animal_bound.height)
    .attr("width",animal_bound.width)
    .attr("fill","none")
    .attr("stroke-width", "5px")
    .attr("stroke","rgb(0,0,0)");

  var cssc = makeArea("CSSC", [animal_bound.width, 0]);
  var cssc_bound = cssc.node().getBBox();
  //var nm432 = makeArea("432nm",[(animal_bound.width/2+cssc_bound.width/2),0]);
//var animal_mgmt = generateSubArea(main,"Animal User","animal-user",dat[1],dat[0],dat[2]);
}
