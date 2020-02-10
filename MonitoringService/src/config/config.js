module.exports = {
  server: {
    port: process.env.NODE_SERVER_PORT || 3001
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '27017',
    dbName: process.env.DB_NAME || 'trivago_audit'
  },
  authorizedServices: [
    {
      business: process.env.BUSINESS_KEY || 'BUSINESS_MONITORING_TOKEN'
    }
  ]
}