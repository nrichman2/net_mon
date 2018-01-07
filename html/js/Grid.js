
var width = $(window).width();
var height = $(window).height();

var agents = []; //[[animal_user,animal_mgmt],
            //[cssc_user,cssc_mgmt],[nm_user,nm_mgmt]]

var SIZE = 20;
var PADDING = 20;
function generateIndivData(){

  var matrix = [];
  for(var row = 0; row<3; row++){

    var column = [];
    for(var col = 0; col<3; col++){
      var baseGateway = 192168001001;
      var baseTarget = 192168255255;
      var obj = {
        "agentObj": {"gateway" : baseGateway},
        "targetObj": {"ip" : baseTarget},
        "xpos": 0,
        "ypos": 0,
        "width": SIZE,
        "height": SIZE,
        "row" : 0
      };
      baseGateway++;
      baseGateway--;
      column.push(obj);
    }
    matrix.push(column);
  }
  return matrix;
}

//console.log(generateData())
var CELLSIZE = 25;
function init(){

  var data = generateIndivData();
  var svg = d3.select("#main")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var grid = svg.append("g")
    .attr("transform","translate("+0+","+0+")");

  var rows = grid.selectAll(".row")
    .data(data)
      .enter()
      .append("g")
      .attr("class", "row");

  var cells = rows.selectAll(".cell")
    .data(function(d,i){    //d is an array, d is current value, i is index
      d.map(function(obj){ //sets obj at i to have row of i, returns obj
        obj.row = i;
        return obj;
      })
    });
  cells.enter()
    .append("rect")
    .attr("width", SIZE)
    .attr("height", SIZE)
    .attr("transform","translate(0,0)");
  cells.exit()
    .remove();
  cells.attr("transform", function(d, i){ return "translate("+i*SIZE+","+d[i].row*SIZE+")"});

}
console.log()
init();
