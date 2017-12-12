import requests

def getList():
	params = {'Accept': 'application/json','Authorization': 'd4fbd8f9bc8dc6b3933297f33a653d86cbae7a56', 'API-VERSION':'v1'}
	r = requests.get('https://wisc.netbeezcloud.net/agents.json',params, verify='/etc/ssl/certs/star_netbeezcloud_net')
	print(r.url)
	print(r.json())
getList();
