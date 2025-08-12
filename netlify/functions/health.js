// Health check function for StethoLink AI
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, OPTIONS'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: 'production',
      message: 'StethoLink AI Health Check - Netlify Functions',
      service: 'netlify-functions',
      region: process.env.AWS_REGION || 'unknown',
      version: '1.0.0'
    })
  };
};
