import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// User Management
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        lastActive: true
      }
    });
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        settings: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In a real app, you would hash this password
        role: role || 'USER'
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        role,
        status
      }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({
      where: { id }
    });
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// User Roles
export const getUserRoles = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: { role: true }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user roles' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

// User Activity
export const getUserActivity = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const activity = await prisma.userActivity.findMany({
      where: { userId: id },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
    
    res.json(activity);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
};

// User Profile
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const profile = await prisma.userProfile.findUnique({
      where: { userId: id }
    });
    
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      avatar, 
      displayName, 
      bio, 
      location, 
      phoneNumber,
      jobTitle,
      department
    } = req.body;
    
    const profile = await prisma.userProfile.upsert({
      where: { userId: id },
      update: {
        avatar,
        displayName,
        bio,
        location,
        phoneNumber,
        jobTitle,
        department
      },
      create: {
        userId: id,
        avatar,
        displayName,
        bio,
        location,
        phoneNumber,
        jobTitle,
        department
      }
    });
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user profile' });
  }
}; 