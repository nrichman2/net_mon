var upper_pad = 0;
/**
*selector: g
*name: name of sub-area
*ags: agents list
*targs: target list
*mat: matrix of agents-->targets
*base: [x, y] coordinates of the base for this sub area
*/
var generateSubArea = function(main, name, id, agents, targets, matrix, base){

  subArea = main.append("g")
    .attr("id", id)
    .attr("class", "sub-area")
    .attr("transform","translate("+base[0]+","+base[1]+")");

  title = subArea.append("text")
      .attr("class","sub-area-title")
      .attr("text-anchor","middle")
      .text(name);
      //.attr("translate("+0+","+0+")");
  grid = subArea.append("g");

  //Target (top) text
  var targetText = grid.selectAll(".target-text")
    .data(targets)
    .enter()
    .append("text")
    .attr("text-anchor","start")
    .attr("class", "target-text")
    .attr("transform",function(d,i){
      return "translate("+(base[0]+i*SIZE+SIZE/2)+","+(base[1]-TEXTPAD)+"), rotate(-45)";
    })
    .text(function(d){
      return d.name;
    })
    .each(findGreatestLength)
    .attr("id", function(d,i){
    return id+"-target-text-"+i;
    })

  targetText.exit()
    .remove();

//Agent (row) text
  var agentText = grid.selectAll(".agent-text")
    .data(agents)
    .enter()
    .append("text")
    .attr("text-anchor","end")
    .text(function(d){
      return d.gateway;
    })
    .attr("transform", function(d,i){
      return "translate("+(base[0]-TEXTPAD)+","+(base[1]+i*SIZE+SIZE/2+10/2)+")";
    })
    .attr("id", function(d,i){
      return id+"-agent-text-"+i;
    })
    .attr("class","grid-text");

  agentText.exit()
    .remove();

//Rows
  var rows = grid.selectAll(".row")
    .data(matrix)
    .enter()
    .append("g")
    .attr("class", "row");

//Cells
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
      .attr("transform", function(d, i){ return "translate("+(base[0]+i*SIZE)+","+(base[1]+d.row*SIZE)+")"})
      .attr("stroke-width","1px")
      .attr("stroke","rgb(0,0,0)")
      .attr("id",function(d){
        return id+"-grid-"+d.row+"-"+d.col;
      })
      .attr("class", "grid-cell")
      .each(cellMake)
      .on("mouseover", function(evt){
        d3.select("#"+id+"-agent-text-"+evt.row).classed("highlight", true);
        d3.select("#"+id+"-target-text-"+evt.col).classed("highlight", true);
        d3.select("#"+id+"-grid-"+evt.row+"-"+evt.col).classed("highlight", true);
      })
      .on("mouseout", function(evt){
        d3.select("#"+id+"-agent-text-"+evt.row).classed("highlight", false);
        d3.select("#"+id+"-target-text-"+evt.col).classed("highlight", false);
        d3.select("#"+id+"-grid-"+evt.row+"-"+evt.col).classed("highlight", false);
      });

  cells.exit()
    .remove();

  grid.attr("transform","translate("+0+","+(upper_pad)+")");
  title.attr("transform","translate("+(base[0]+targets.length*SIZE/2)+","+(base[1]+0)+")")
  //"transform", function(d, i){ return "translate("+i*SIZE+","+d.row*SIZE+")"});
  //console.log(d3.select("#animal-user").node().getBBox());
  return d3.select("#"+id);
}

var findGreatestLength = function(textObj){
  var rect = d3.select(this).node().getBBox();
  var h = rect.width*Math.cos(Math.PI/4)+TEXTPAD;
  if(h > upper_pad){
    upper_pad = h+TEXTPAD*4;
  }
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
