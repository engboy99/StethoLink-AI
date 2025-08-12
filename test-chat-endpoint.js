const http = require('http');

// Test the new general chat endpoint
function testChatEndpoint() {
    console.log('🧪 Testing General Chat Endpoint...\n');
    
    const postData = JSON.stringify({
        message: 'Tell me about 1st year medical curriculum',
        userId: 'test-user',
        context: 'study-plans'
    });
    
    const options = {
        hostname: 'localhost',
        port: 3000,
        path: '/api/general-chat',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };
    
    const req = http.request(options, (res) => {
        console.log(`📡 Status: ${res.statusCode}`);
        console.log(`📋 Headers: ${JSON.stringify(res.headers, null, 2)}`);
        
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                console.log('\n✅ Response:');
                console.log(JSON.stringify(response, null, 2));
                
                if (response.success) {
                    console.log('\n🎉 Chat endpoint is working correctly!');
                } else {
                    console.log('\n❌ Chat endpoint returned error:', response.error);
                }
            } catch (error) {
                console.log('\n❌ Failed to parse response:', error.message);
                console.log('Raw response:', data);
            }
        });
    });
    
    req.on('error', (error) => {
        console.error('❌ Request failed:', error.message);
    });
    
    req.write(postData);
    req.end();
}

// Run test
testChatEndpoint(); 