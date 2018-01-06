
var width = $(window).width();
var height = $(window).height();

var agents = []; //[[animal_user,animal_mgmt],
            //[cssc_user,cssc_mgmt],[nm_user,nm_mgmt]]

var CELLSIZE = 25;
function init(){

  var grid = d3.select("#grid").append("svg")
    .attr("width", width)
    .attr("height", height);

  var animal = grid.append("g")
    .attr("transform","translate("+0+","+0+")")

}

init();
