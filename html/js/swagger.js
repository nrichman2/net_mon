var swagger = "https://wisc.netbeezcloud.net/"
function getAgents(){
//  var data = {
    //Authorization : "d4fbd8f9bc8dc6b3933297f33a653d86cbae7a56",
    //API-VERSION : "v1";
  //}
  return $.getJSON(swagger+'agents/active.json');//, data);
}
var data = {
  "Authorization" : "d4fbd8f9bc8dc6b3933297f33a653d86cbae7a56",
  "API-VERSION" : "v1",
  "test_type_id" : 1
};
function getPingStatusByAgent(id){
  return $.getJSON(swagger+'agents/'+id+'/test_statuses_by_type.json',data);
}

console.log(getPingStatusByAgent(2));
