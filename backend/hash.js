// ============ BLOCK 1: IMPORT ============

// Import bcrypt, a library that hashes passwords so the real password is never stored
// Note: your routes use 'bcryptjs', but this file uses 'bcrypt' (see notes below)
import bcrypt from 'bcrypt';


// ============ BLOCK 2: GENERATE HASH FUNCTION ============

// A function that creates a hashed password
// 'async' is used because hashing takes time and we use 'await'
async function generateHash() {
    // Hash the password '123456'
    // 10 = "salt rounds": how strong/slow the hashing is (higher = safer but slower)
    // 'await' waits until the hash is finished
    const hash = await bcrypt.hash('123456', 10);

    // Print a heading line in the terminal
    console.log("Your hashed password is:");

    // Print the hashed result (looks like: $2b$10$abc123...)
    console.log(hash);
}


// ============ BLOCK 3: RUN THE FUNCTION ============

// Call the function so it actually runs when you execute this file
// Example: node generateHash.js
generateHash();