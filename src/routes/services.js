const { Router } = require('express');
const { body } = require('express-validator');
const serviceController = require('../controllers/serviceController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

/**
 * @swagger
 * /services:
 *   post:
 *     summary: Create a new service
 *     tags: [Services]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               price: { type: number }
 *               category: { type: string }
 *     responses:
 *       201:
 *         description: Service created
 */
router.post(
  '/',
  authenticate,
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 chars'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
    body('description').optional().trim(),
    body('category').optional().trim(),
  ],
  validate,
  serviceController.createService
);

/**
 * @swagger
 * /services:
 *   get:
 *     summary: Get all services
 *     tags: [Services]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of services
 */
router.get('/', serviceController.getAllServices);

/**
 * @swagger
 * /services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Service data
 */
router.get('/:id', serviceController.getServiceById);

/**
 * @swagger
 * /services/{id}:
 *   put:
 *     summary: Update service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Updated service
 */
router.put('/:id', authenticate, serviceController.updateService);

/**
 * @swagger
 * /services/{id}:
 *   delete:
 *     summary: Delete service
 *     tags: [Services]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Service deleted
 */
router.delete('/:id', authenticate, serviceController.deleteService);

module.exports = router;
