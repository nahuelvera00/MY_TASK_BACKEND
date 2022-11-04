import mongose from "mongoose";

async function connectDB() {
  try {
    const db = await mongose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${db.connection.host}:${db.connection.port}`;
    console.log(`[+] DB connected: ${url}`);
  } catch (error) {
    console.log(`[-] Error: ${error.message}`);
    process.exit(1);
  }
}

export default connectDB;
