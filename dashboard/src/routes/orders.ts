import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all orders
router.get('/', authenticateToken, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        customer: true,
        items: true,
        status: true
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get single order
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true
          }
        },
        status: true,
        payments: true,
        shipment: true
      }
    });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// Create order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      customerId,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    } = req.body;

    const order = await prisma.order.create({
      data: {
        customerId,
        items: {
          create: items
        },
        shippingAddress,
        billingAddress,
        paymentMethod,
        notes,
        status: 'PENDING'
      },
      include: {
        items: true
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Update order
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: orderData,
      include: {
        items: true
      }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// Delete order
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.order.delete({
      where: { id }
    });
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete order' });
  }
});

// Update order status
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Get order history
router.get('/customer/:customerId', authenticateToken, async (req, res) => {
  try {
    const { customerId } = req.params;
    const orders = await prisma.order.findMany({
      where: { customerId },
      include: {
        items: true,
        status: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch order history' });
  }
});

export default router; 