// ============ BLOCK 1: IMPORT ============

// Import Mongoose, the library that connects Node.js to MongoDB
// and lets us define the shape (schema) of our data
import mongoose from 'mongoose';


// ============ BLOCK 2: SCHEMA FIELDS ============

// A schema is a blueprint: it says what fields a user record can have
const userSchema = new mongoose.Schema({
  // User's full name: must be text, and cannot be left empty
  name: { type: String, required: true },

  // User's email: must be text, cannot be empty,
  // and "unique: true" means no two users can have the same email
  email: { type: String, required: true, unique: true },

  // User's password: must be text and cannot be empty
  // (the routes store the HASHED password here, not the real one)
  password: { type: String, required: true },

  // User's role (e.g. admin, site engineer, qa officer)
  // If no role is given, it becomes 'user'
  type: { type: String, default: 'user' },

  // How many wrong passwords were typed in a row (starts at 0)
  // Used by the login route to lock the account after 5 failures
  failedLoginAttempts: { type: Number, default: 0 },

  // Date and time until which the account is locked
  // null means "not locked"
  lockUntil: { type: Date, default: null }

// ============ BLOCK 3: SCHEMA OPTIONS ============
}, { 
  // Automatically add and update createdAt and updatedAt fields
  timestamps: true 
});


// ============ BLOCK 4: MODEL CREATION AND EXPORT ============

// Create the model named 'User' from the schema and export it
// MongoDB will store these records in a collection called "users"
// (Mongoose makes the name lowercase and adds an "s")
export default mongoose.model('User', userSchema);