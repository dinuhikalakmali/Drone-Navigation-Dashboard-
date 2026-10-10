// ============ BLOCK 1: IMPORT ============

// Import Mongoose, the library that connects Node.js to MongoDB
import mongoose from 'mongoose';


// ============ BLOCK 2: CONNECT TO DATABASE ============

// A function that connects to the database
// 'async' is used because connecting takes time and we use 'await'
const connectDB = async () => {
  // 'try' runs the code; 'catch' handles connection errors
  try {
    // Connect to MongoDB using the address stored in the .env file
    // Example MONGO_URI: mongodb+srv://user:password@cluster.mongodb.net/dbname
    // 'await' waits until the connection is finished
    const conn = await mongoose.connect(process.env.MONGO_URI);

    // Print a success message with the name of the database server we connected to
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Connection failed (wrong address, no internet, wrong password, etc.)
    // Print the reason for the failure
    console.error(`Error: ${error.message}`);

    // Stop the whole Node.js program
    // (1 = exit with an error; 0 would mean a normal exit)
    process.exit(1);
  }
};


// ============ BLOCK 3: EXPORT ============

// Export the function so server.js can import and call it
export default connectDB;