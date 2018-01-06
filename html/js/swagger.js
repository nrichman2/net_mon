function getAgents(){
  var data = {
    "Authorization" : "",
    "API-VERSION" : "v1"
  }
  $().getJSON('https://wisc.netbeezcloud.net/agents.json')
}
