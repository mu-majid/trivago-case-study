module.exports = {
  server: {
    port: process.env.API_GW_PORT || 8080
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '27017',
    dbName: process.env.DB_NAME || 'trivago_gw',
    dbNameTesting: process.env.TESTING_DB_NAME || 'trivago_gw_test'
  },
  services: {
    business: {
      url: process.env.BUSINESS_SERVICE_URL || 'http://localhost:3000'
    }
  },
  access_key: process.env.API_GATEWAY_KEY || 'apigateway', // used by gw to identify itself to business service
  roles: {
    CUSTOMER: 'CUSTOMER',
    ADMIN: 'ADMIN'
  }
}