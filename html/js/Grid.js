var grid;
var width = $(window).width();
var height = $(window).height();

var CELLSIZE = 25;
function init(){

  var grid = d3.select("#grid").append("svg")
    .attr("width", width)
    .attr("height", height);

  var animal = grid.append("g")
    .attr("transform","translate("+0+","+0+")")

  var cssc = grid.append("g")
    .attr("transform","translate("+0+","+0+")")

  var nm432 = grid.append("g")
    .attr("transform","translate("+0+","+0+")")
      
}
