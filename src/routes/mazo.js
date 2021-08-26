const express = require('express');

const router = express.Router();
const {
  createMazo,
  getMazos,
  getMazoDetails,
  updateMazos,
  deleteMazo,
} = require('../controllers/mazoController');

router.post('/', createMazo);
router.get('/', getMazos);
router.get('/:id', getMazoDetails);
router.patch('/:id', updateMazos);
router.delete('/:id', deleteMazo);

module.exports = router;
