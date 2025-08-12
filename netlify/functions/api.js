// FORCE REBUILD: 2025-08-12 - Clean API function without serverless-http
exports.handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
      }
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  
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
          message: 'StethoLink AI API',
          status: 'running',
          timestamp: new Date().toISOString(),
          endpoints: ['/health', '/api/test', '/api/medical/calculators']
        })
      };
      
    case '/test':
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          message: 'API is working from Netlify Functions',
          timestamp: new Date().toISOString()
        })
      };
      
    case '/medical/calculators':
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          calculators: [
            'BMI Calculator',
            'GFR Calculator', 
            'CHADS2 Score',
            'APACHE II Score',
            'Glasgow Coma Scale',
            'PHQ-9 Depression Screen'
          ],
          status: 'available'
        })
      };
      
    case '/medical/features':
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          features: [
            'Medical Image Analysis',
            'Research Assistant AI',
            'Patient Simulation',
            'Clinical Guidelines',
            'Drug Database',
            'Emergency Training'
          ],
          status: 'active'
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
          message: `The requested route ${path} does not exist`
        })
      };
  }
};
