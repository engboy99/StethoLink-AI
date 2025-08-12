const http = require('http');

console.log('🧪 Testing server character encoding fix...');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`✅ Content-Type: ${res.headers['content-type']}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log(`✅ Content length: ${data.length} characters`);
    
    // Check if emojis are properly encoded
    if (data.includes('🏥') && data.includes('👨‍⚕️') && data.includes('👩‍⚕️')) {
      console.log('✅ Emojis are properly encoded!');
    } else {
      console.log('❌ Emojis are not properly encoded');
      console.log('Found emojis:', {
        '🏥': data.includes('🏥'),
        '👨‍⚕️': data.includes('👨‍⚕️'),
        '👩‍⚕️': data.includes('👩‍⚕️')
      });
    }
    
    // Check for question marks (encoding issues)
    if (data.includes('????')) {
      console.log('❌ Found question marks - encoding issue still exists');
    } else {
      console.log('✅ No question marks found - encoding looks good');
    }
    
    console.log('\n🎯 Test completed!');
    process.exit(0);
  });
});

req.on('error', (err) => {
  console.error('❌ Error testing server:', err.message);
  process.exit(1);
});

req.end(); 