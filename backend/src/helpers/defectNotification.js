import User from '../models/userModel.js';

/**
 * Get all users who have access to view defects
 * Includes admins, managers, and users with specific roles
 */
export const getDefectAccessUsers = async () => {
  try {
    const users = await User.find({
      $or: [
        { type: 'admin' },
        { type: 'Admin' },
        { type: 'manager' },
        { type: 'Manager' },
        { roles: { $in: ['can_view_defects', 'can_manage_defects'] } }
      ]
    }).select('name email type');

    console.log(`📧 Found ${users.length} users eligible for defect notifications`);
    return users;
  } catch (error) {
    console.error('❌ Error fetching defect access users:', error.message);
    return [];
  }
};

/**
 * Get users by specific role
 */
export const getUsersByRole = async (role) => {
  try {
    const users = await User.find({
      $or: [
        { type: role },
        { roles: { $in: [role] } }
      ]
    }).select('name email type');

    return users;
  } catch (error) {
    console.error('❌ Error fetching users by role:', error.message);
    return [];
  }
};

/**
 * Get all active users (optional for other notifications)
 */
export const getAllActiveUsers = async () => {
  try {
    const users = await User.find().select('name email type');
    return users;
  } catch (error) {
    console.error('❌ Error fetching all users:', error.message);
    return [];
  }
};

export default { getDefectAccessUsers, getUsersByRole, getAllActiveUsers };
