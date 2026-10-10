// ============ BLOCK 1: IMPORT ============

// Import the User model (used to search the "users" collection in MongoDB)
import User from '../models/userModel.js';


// ============ BLOCK 2: GET DEFECT ACCESS USERS ============

/**
 * Get all users who have access to view defects
 * Includes admins, managers, and users with specific roles
 */
// Used by defectWatcher.js and detectionRouter.js to find who gets the alert email
export const getDefectAccessUsers = async () => {
  // 'try' runs the code; 'catch' handles database errors
  try {
    // Search the users collection
    const users = await User.find({
      // $or = a user matches if ANY one of the conditions below is true
      $or: [
        { type: 'admin' },      // role is 'admin' (small letters)
        { type: 'Admin' },      // role is 'Admin' (capital A)
        { type: 'manager' },    // role is 'manager'
        { type: 'Manager' },    // role is 'Manager'

        // The user has a "roles" list containing either of these permissions
        // ($in = "is any one of these values")
        { roles: { $in: ['can_view_defects', 'can_manage_defects'] } }
      ]
    }).select('name email type'); // only return name, email and type (not the password)

    // Print how many users were found
    console.log(`📧 Found ${users.length} users eligible for defect notifications`);

    // Give the list back to whoever called this function
    return users;
  } catch (error) {
    // If the database search fails, print the error message
    console.error('❌ Error fetching defect access users:', error.message);

    // Return an empty list so the caller does not crash
    return [];
  }
};


// ============ BLOCK 3: GET USERS BY ROLE ============

/**
 * Get users by specific role
 */
// "role" is the role name passed in, e.g. getUsersByRole('qa officer')
export const getUsersByRole = async (role) => {
  try {
    const users = await User.find({
      $or: [
        // The user's type matches the given role exactly
        { type: role },

        // OR the user's "roles" list contains the given role
        { roles: { $in: [role] } }
      ]
    }).select('name email type'); // only return name, email and type

    // Give back the matching users
    return users;
  } catch (error) {
    // Print the error and return an empty list so nothing crashes
    console.error('❌ Error fetching users by role:', error.message);
    return [];
  }
};


// ============ BLOCK 4: GET ALL USERS ============

/**
 * Get all active users (optional for other notifications)
 */
export const getAllActiveUsers = async () => {
  try {
    // No filter given, so this returns every user
    // Only name, email and type are included
    const users = await User.find().select('name email type');

    // Give back the list
    return users;
  } catch (error) {
    // Print the error and return an empty list so nothing crashes
    console.error('❌ Error fetching all users:', error.message);
    return [];
  }
};


// ============ BLOCK 5: EXPORT ============

// Export all three functions together as the default export
// (the named exports above also work: import { getDefectAccessUsers } from ...)
export default { getDefectAccessUsers, getUsersByRole, getAllActiveUsers };