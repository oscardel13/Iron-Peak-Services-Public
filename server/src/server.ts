import http from 'http';

import app from './app.ts';

// Connect to prismas postgres database
// const { mongoConnect } = require('./utils/mongo');

const PORT = process.env.PORT || 8000;

const NETWORK_IP = process.env.NETWORK_IP_ADDRESS || "127.0.0.1"

async function startServer() {
  const server = http.createServer(app)
  // await mongoConnect()
  server.listen(PORT,()=>{
    console.log(`listening on port: ${PORT} \nnetwork: ${NETWORK_IP}:3000`)
  })
}

startServer();