module.exports = {
  server: {
    port: process.env.NODE_SERVER_PORT || 3000
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '27017',
    dbName: process.env.DB_NAME || 'trivago_dev',
    dbNameTesting: process.env.TESTING_DB_NAME || 'trivago_test'

  },
  services: {
    monitoring: {
      url: process.env.MONITOR_URI || 'http://localhost:3001'
    }
  },
  access_token: { // used by business to identify itself to monitoring
    monitoringToken: process.env.BUSINESS_KEY || 'businesskey'
  },
  authorizedServices: [
    {
      name: 'api_gateway',
      api_key: process.env.API_GATEWAY_KEY || 'apigateway'
    }
  ],
  publicAccessPolicyKey: process.env.PUBLIC_ACCESS_KEY || 'public-api-secret',
  privateAccessPolicyKey: process.env.PRIVATE_ACCESS_KEY || 'private-api-secret'

}