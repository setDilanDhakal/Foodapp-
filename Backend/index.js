import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

let isConnected = false;
const connect = async () => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
};

export default async function (req, res) {
  await connect();
  return app(req, res);
}

const port = Number(process.env.PORT) || 3000

// Only listen locally, Vercel will use the exported function
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  connect().then(() => {
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  }).catch(error => {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  })
}
