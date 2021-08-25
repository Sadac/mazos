const express = require('express');
const {
  createUser,
  getUsers,
  updateUser,
  deleteUser,
  addMedal,
} = require('../controllers/userController');

const router = express.Router();
router.post('/', createUser);
router.get('/', getUsers);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);
router.post('/add', addMedal);

module.exports = router;
