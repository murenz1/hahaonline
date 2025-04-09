import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all team members
router.get('/', authenticateToken, async (req, res) => {
  try {
    const members = await prisma.teamMember.findMany({
      include: {
        user: true,
        role: true,
        department: true
      }
    });
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team members' });
  }
});

// Get single team member
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const member = await prisma.teamMember.findUnique({
      where: { id },
      include: {
        user: true,
        role: true,
        department: true,
        tasks: true,
        schedule: true
      }
    });
    if (!member) {
      return res.status(404).json({ error: 'Team member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team member' });
  }
});

// Create team member
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      userId,
      roleId,
      departmentId,
      position,
      startDate,
      status
    } = req.body;

    const member = await prisma.teamMember.create({
      data: {
        userId,
        roleId,
        departmentId,
        position,
        startDate: new Date(startDate),
        status
      },
      include: {
        user: true,
        role: true,
        department: true
      }
    });

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

// Update team member
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const memberData = req.body;

    const member = await prisma.teamMember.update({
      where: { id },
      data: memberData,
      include: {
        user: true,
        role: true,
        department: true
      }
    });

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update team member' });
  }
});

// Delete team member
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.teamMember.delete({
      where: { id }
    });
    res.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete team member' });
  }
});

// Get team departments
router.get('/departments', authenticateToken, async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        members: true,
        manager: true
      }
    });
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch departments' });
  }
});

// Get team roles
router.get('/roles', authenticateToken, async (req, res) => {
  try {
    const roles = await prisma.teamRole.findMany();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team roles' });
  }
});

// Get team member schedule
router.get('/:id/schedule', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await prisma.schedule.findMany({
      where: { teamMemberId: id },
      orderBy: { date: 'asc' }
    });
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team member schedule' });
  }
});

// Get team member tasks
router.get('/:id/tasks', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await prisma.task.findMany({
      where: { assignedToId: id },
      include: {
        assignedBy: true,
        project: true
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team member tasks' });
  }
});

export default router; 