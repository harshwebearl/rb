const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Get all plans
router.get('/', planController.getAllPlans);

// Book a plan
router.post('/book', planController.bookPlan);

// Get single plan
router.get('/:id', planController.getPlanById);

// Create new plan
router.post('/', planController.createPlan);

// Update plan
router.put('/:id', planController.updatePlan);

// Delete plan
router.delete('/:id', planController.deletePlan);

module.exports = router;
