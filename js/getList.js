var https=require('https');
var fs = require('fs');

const options = {
	hostname: 'wisc.netbeezcloud.net',
	path: '/agents.json',
	method: 'GET',
	cert: fs.readFileSync('/etc/ssl/certs/star_netbeezcloud_net.pem'),
	headers: {
		'Accept': 'application/json',
		'Authentication': 'd4fbd8f9bc8dc6b3933297f33a653d86cbae7a56',
		'API-VERSION': 'v1'
	}
};

const req = https.request(options, (res) => {
	console.log("connected");
	console.log('statusCode: ', res.statusCode);
	console.log('headers: ', res.headers);
	res.on('data', (chunk) =>{
		console.log('BODY: ${chunk}');
	});

});

