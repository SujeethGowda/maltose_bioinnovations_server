const express = require('express');

const fieldVisitController = require('../controllers/field_visit_controller');

const router = express.Router();

// router.get('/fieldvisit', fieldVisitController.getProducts);

router.post('/createfieldvisit', fieldVisitController.fieldVisitRequest);

router.post('/createfieldvisit', fieldVisitController.fieldVisitRequest);

module.exports = router;