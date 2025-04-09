import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all inventory items
router.get('/', authenticateToken, async (req, res) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        category: true,
        supplier: true
      }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory items' });
  }
});

// Get single inventory item
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        category: true,
        supplier: true,
        transactions: true
      }
    });
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

// Create inventory item
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      name,
      description,
      sku,
      quantity,
      price,
      categoryId,
      supplierId,
      reorderPoint,
      location
    } = req.body;

    const item = await prisma.inventoryItem.create({
      data: {
        name,
        description,
        sku,
        quantity,
        price,
        categoryId,
        supplierId,
        reorderPoint,
        location
      }
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// Update inventory item
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const itemData = req.body;

    const item = await prisma.inventoryItem.update({
      where: { id },
      data: itemData
    });

    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// Delete inventory item
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.inventoryItem.delete({
      where: { id }
    });
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

// Get inventory categories
router.get('/categories', authenticateToken, async (req, res) => {
  try {
    const categories = await prisma.inventoryCategory.findMany();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory categories' });
  }
});

// Get inventory transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const transactions = await prisma.inventoryTransaction.findMany({
      include: {
        item: true,
        user: true
      }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inventory transactions' });
  }
});

export default router; 