
const https = require('https');

const options = {
  hostname: 'hmrs.onrender.com',
  port: 443,
  path: '/api/employers/getAll',
  method: 'GET',
  headers: {
    'Origin': 'http://localhost:3000'
  }
};

const req = https.request(options, (res) => {
  console.log('StatusCode:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
});

req.on('error', (e) => {
  console.error(e);
});

req.end();
