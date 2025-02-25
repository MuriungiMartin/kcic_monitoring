export default async function handler(req, res) {
  const response = await fetch('http://185.219.142.163:7047' + req.url, {
    method: req.method,
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': 'fnloginCustomer',
      'Authorization': 'Basic ' + Buffer.from('Appkings:Appkings@254!').toString('base64')
    },
    body: req.method !== 'GET' ? req.body : undefined
  });

  const data = await response.text();
  res.status(response.status).send(data);
} 