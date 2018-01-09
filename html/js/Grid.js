
var width = $(window).width();
var height = $(window).height();
var svg;
var grid;
var area;
var user;
var upper_pad = 0;


var TEXTPAD = 5;

var agents = []; //[[animal_user,animal_mgmt],
            //[cssc_user,cssc_mgmt],[nm_user,nm_mgmt]]
var targets = [];
var matrix = [];

var SIZE = 25;
function generateIndivData(){
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
}


//console.log(generateData())

function init(){

  svg = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  area = svg.append("g")
    .attr("transform","translate("+0+","+0+")");

  user = area.append("text")
      .attr("class","sub-area")
      .attr("text-anchor","middle")
      .attr("transform","translate("+-30+","+0+")")
      .text("Animal User Vlans");
  console.log(user);
      //.attr("translate("+0+","+0+")");
  grid = area.append("g")
    .attr("transform","translate("+0+","+0+")");


  var zoom = d3.zoom()//code from bl.ocks.org/shawnbot/6518285
    .scaleExtent([.4,5]).on("zoom",function(d){
      var e = d3.event;
      //zoom.translateBy(d,[tx, ty]);
      //console.log(["translate(" + [tx,ty]+")","scale("+e.scale+")"].join(" "));
      area.attr("transform", e.transform);
      //    "scale("+e.scale+")"].join(" "));
    });
  svg.call(zoom);
  generateIndivData()
  update();
}
function update(){

  var data = matrix;

  var targetText = grid.selectAll(".target-text")
    .data(targets)
    .enter()
    .append("text")
    .attr("text-anchor","start")
    .attr("transform",function(d,i){
      console.log("translate("+i*SIZE+","+0+")");
      return "translate("+(i*SIZE+SIZE/2)+","+-TEXTPAD+"), rotate(-45)";
    })
    .text(function(d){
      return d.name;
    })
    .each(findGreatestLength);
    console.log(upper_pad);
  user.attr("transform","translate("+0+","+(-upper_pad-20)+")");
  targetText.attr("id", function(d,i){
    return "target-text-"+i;
  })
  .attr("class","grid-text");
  targetText.exit()
    .remove();

  var agentText = grid.selectAll(".agent-text")
    .data(agents)
    .enter()
    .append("text");
  agentText.attr("text-anchor","end")
    .text(function(d){
      return d.gateway;
    })
    .attr("transform", function(d,i){
      return "translate("+-TEXTPAD+","+(i*SIZE+SIZE/2+10/2)+")";
    })
    .attr("style","font-size: 15px")
    .attr("id", function(d,i){
      return "agent-text-"+i;
    })
    .attr("class","grid-text");
  agentText.exit().remove();


  var rows = grid.selectAll(".row")
    .data(data)
      .enter()
      .append("g")
      .attr("class", "row");

  var cells = rows.selectAll(".cell")
    .data(function(d,i){    //d is an array, d is current value, i is index
      var col = 0;
      return d.map(function(obj){ //sets obj at i to have row of i, returns obj

        obj.col = col;
        obj.row = i;      //set column variable
        col++;
        return obj;
      })
    });
  cells.enter()
      .append("rect")
      .attr("width", SIZE)
      .attr("height", SIZE)
      .attr("transform", function(d, i){ return "translate("+i*SIZE+","+d.row*SIZE+")"})
      .attr("stroke-width","1px")
      .attr("stroke","rgb(0,0,0)")
      .attr("id",function(d){
        return "grid"+d.row+"-"+d.col;
      })
      .attr("class", "grid")
      .each(cellMake)
      .on("mouseover", function(evt){
        d3.select("#agent-text-"+evt.row).classed("highlight", true);
        d3.select("#target-text-"+evt.col).classed("highlight", true);
        d3.select("#grid"+evt.row+"-"+evt.col).classed("highlight", true);
      })
      .on("mouseout", function(evt){
        d3.select("#agent-text-"+evt.row).classed("highlight", false);
        d3.select("#target-text-"+evt.col).classed("highlight", false);
        d3.select("#grid"+evt.row+"-"+evt.col).classed("highlight", false);
      });

  cells.exit()
    .remove();
  //"transform", function(d, i){ return "translate("+i*SIZE+","+d.row*SIZE+")"});
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
  if(rect.height > upper_pad){
    upper_pad = rect.height+10;
  }
}
