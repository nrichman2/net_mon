
var width = $(window).width();
var height = $(window).height();

var TEXTPAD = 5;
var svg;
var main;
var AREAPAD = 2;
var BETWEENPAD = 10;
var VIEWPAD = 20;

var SIZE = 16;
/**
* Returns [targets, agents, matrix]
*/
function generateIndivData(){
  var tot = [];
  var targets = [];
  var agents = [];
  var matrix = [];
  for(var row = 0; row<20; row++){
    var baseGateway = 192168001001; //agent vars.
    var column = [];
    for(var col = 0; col<20; col++){
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

function makeArea(name, base, idname){
  var dat1 = generateIndivData();
  var dat2 = generateIndivData();
  var container =main.append("g")
    .attr("id",idname+"-container")
    .attr("transform","translate("+base[0]+","+base[1]+")");
  var title = container.append("text")
    .text(name)
    .attr("text-anchor","middle")
    .attr("class","area-title");


  var title_bound = title.node().getBBox();

  var area = container.append("g")
    .attr("id",name.toLowerCase())
    .attr("transform","translate("+0+","+(title_bound.height)+")");
  var user = generateSubArea(area, name+" User",idname+"-user",dat1[1],dat1[0],dat1[2], [0,0]);
  var u_bound = user.node().getBBox();

  var user = generateSubArea(area, name+" Management",idname+"-mgmt"
    ,dat2[1],dat2[0],dat2[2], [u_bound.width/2,0]);
  title.attr("transform","translate("+container.node().getBBox().width/2.5+","+0+")");
  var bound = container.node().getBBox();
  console.log(bound);
  main.append("rect")
    .attr("x",(bound.x-AREAPAD))
    .attr("y",(bound.y-AREAPAD*2))
    .attr("height",(bound.height+AREAPAD*4))
    .attr("width",(bound.width+AREAPAD*2))
    .attr("fill","none")
    .attr("stroke-width", "2px")
    .attr("stroke","rgb(0,0,0)")
    .attr("transform","translate("+base[0]+","+base[1]+")");

  return container;
}

function init(){
  svg = d3.select("#main")
    .append("svg")
    .attr("width",width)
    .attr("height",height);
  //  .attr("viewbox","-30 -30 1000 400")
  var zoom = d3.zoom()//code from bl.ocks.org/shawnbot/6518285
    .scaleExtent([.6,3.5]).on("zoom",function(d){
      var e = d3.event;
      //zoom.translateBy(d,[tx, ty]);
      //console.log(["translate(" + [tx,ty]+")","scale("+e.scale+")"].join(" "));
      main.attr("transform", e.transform);
      //    "scale("+e.scale+")"].join(" "));
    });
  main = svg.append("g");
    //.attr("transform","translate("+(30)+","+(30)+") scale(.7)");
  //  .attr("transform","scale(.7)");


  svg.call(zoom);

  update();
  var bound = main.node().getBBox();
  svg.attr("viewBox", [bound.x-VIEWPAD, bound.y-VIEWPAD,
     bound.width+VIEWPAD*2, bound.height+VIEWPAD*2].join(" "));
}

function update(){
  var animal = makeArea("Animal",[0,0], "animal");
  var animal_bound = animal.node().getBBox();


  var cssc = makeArea("CSSC", [animal_bound.width+BETWEENPAD, 0], "cssc");
  var cssc_bound = cssc.node().getBBox();

  var nm = makeArea("432nm", [animal_bound.width+cssc_bound.width+BETWEENPAD*2,0],"nm")

  //var nm432 = makeArea("432nm",[(animal_bound.width/2+cssc_bound.width/2),0]);
//var animal_mgmt = generateSubArea(main,"Animal User","animal-user",dat[1],dat[0],dat[2]);
}
