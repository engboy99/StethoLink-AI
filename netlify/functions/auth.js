// FORCE REBUILD: 2025-08-12 - Auth function for StethoLink AI
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };
  }

  const path = event.path.replace('/.netlify/functions/auth', '');
  
  // Route based on path
  switch (path) {
    case '':
    case '/':
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          message: 'StethoLink AI Auth Service',
          status: 'running',
          timestamp: new Date().toISOString(),
          endpoints: ['/register', '/login', '/logout', '/profile']
        })
      };
      
    case '/register':
      if (event.httpMethod === 'POST') {
        try {
          const body = JSON.parse(event.body || '{}');
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              success: true,
              message: 'Registration endpoint ready',
              timestamp: new Date().toISOString(),
              note: 'This is a mock response. Implement actual registration logic.'
            })
          };
        } catch (error) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              success: false,
              error: 'Invalid JSON in request body'
            })
          };
        }
      }
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Method not allowed',
          message: 'Use POST method for registration'
        })
      };
      
    case '/login':
      if (event.httpMethod === 'POST') {
        try {
          const body = JSON.parse(event.body || '{}');
          return {
            statusCode: 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              success: true,
              message: 'Login endpoint ready',
              timestamp: new Date().toISOString(),
              note: 'This is a mock response. Implement actual login logic.'
            })
          };
        } catch (error) {
          return {
            statusCode: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
              success: false,
              error: 'Invalid JSON in request body'
            })
          };
        }
      }
      return {
        statusCode: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Method not allowed',
          message: 'Use POST method for login'
        })
      };
      
    default:
      return {
        statusCode: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          error: 'Route not found',
          message: `The requested auth route ${path} does not exist`
        })
      };
  }
};
