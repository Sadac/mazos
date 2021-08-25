const express = require('express');

const router = express.Router();
const {
  createMedalla,
  getMedallas,
  updateMedallas,
  deleteMedalla,
} = require('../controllers/medallaController');

router.post('/', createMedalla);
router.get('/', getMedallas);
router.patch('/:id', updateMedallas);
router.delete('/:id', deleteMedalla);

module.exports = router;
