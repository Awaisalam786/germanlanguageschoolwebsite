import https from 'https';
https.get('https://germanlearningschool.com/practice-tests', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const scripts = data.match(/src="([^"]+\.js)"/g);
    console.log(scripts);
  });
});
