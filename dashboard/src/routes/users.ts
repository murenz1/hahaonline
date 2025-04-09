import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserRoles,
  updateUserRole,
  getUserActivity,
  getUserProfile,
  updateUserProfile
} from '../controllers/users';

const router = Router();

// User Management
router.get('/', authenticateToken, getUsers);
router.get('/:id', authenticateToken, getUserById);
router.post('/', authenticateToken, createUser);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

// User Roles
router.get('/:id/roles', authenticateToken, getUserRoles);
router.put('/:id/roles', authenticateToken, updateUserRole);

// User Activity
router.get('/:id/activity', authenticateToken, getUserActivity);

// User Profile
router.get('/:id/profile', authenticateToken, getUserProfile);
router.put('/:id/profile', authenticateToken, updateUserProfile);

export default router; 