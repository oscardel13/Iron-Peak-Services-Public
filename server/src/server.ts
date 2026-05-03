import http from 'http';

import app from './app.ts';

import { startDumpsterStatusCronJob } from './cron-job/dumpster-status-update.ts';


const PORT = process.env.PORT || 8000;

const NETWORK_IP = process.env.NETWORK_IP_ADDRESS || "127.0.0.1"

async function startServer() {
  const server = http.createServer(app)
  startDumpsterStatusCronJob();

  // await mongoConnect()
  server.listen(PORT,()=>{
    console.log(`listening on port: ${PORT} \nnetwork: ${NETWORK_IP}:3000`)
  })
}

startServer();